"""Train the small convolutional neural network behind the "Draw a digit" game.

Data: MNIST (60,000 training and 10,000 test images of handwritten digits, 28x28 pixels).
Model: conv(8) -> pool -> conv(16) -> pool -> dense(64) -> dense(10), about 52,000 weights.
Training: Adam, with random rotation, scaling, shifting and stroke-thickness changes so the
model copes with digits drawn by mouse or finger rather than scanned from paper.

Output: public/models/digits.json (weights, plus one example image per digit for the
"Show an example" button). Run from the repo root:

    pip install "jax[cpu]" numpy
    python scripts/train_digits.py
"""

from __future__ import annotations

import base64
import gzip
import json
import os
import time
import urllib.request

import jax
import jax.numpy as jnp
import numpy as np

DATA_URL = "https://raw.githubusercontent.com/fgnt/mnist/master/"
FILES = {
    "x_train": "train-images-idx3-ubyte.gz",
    "y_train": "train-labels-idx1-ubyte.gz",
    "x_test": "t10k-images-idx3-ubyte.gz",
    "y_test": "t10k-labels-idx1-ubyte.gz",
}
CACHE = os.path.join(os.path.dirname(__file__), ".mnist")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "models", "digits.json")

EPOCHS = int(os.environ.get("EPOCHS", 15))
BATCH = 128
SEED = 7


# ---------------------------------------------------------------- data
def load_idx(name: str) -> np.ndarray:
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, FILES[name])
    if not os.path.exists(path):
        urllib.request.urlretrieve(DATA_URL + FILES[name], path)
    with gzip.open(path, "rb") as f:
        raw = f.read()
    if name.startswith("x"):
        n = int.from_bytes(raw[4:8], "big")
        return np.frombuffer(raw, dtype=np.uint8, offset=16).reshape(n, 28, 28)
    return np.frombuffer(raw, dtype=np.uint8, offset=8)


# ---------------------------------------------------------------- model
def init_params(key):
    k1, k2, k3, k4 = jax.random.split(key, 4)

    def he(k, shape, fan_in):
        return jax.random.normal(k, shape) * jnp.sqrt(2.0 / fan_in)

    return {
        "c1w": he(k1, (3, 3, 1, 8), 9),
        "c1b": jnp.zeros(8),
        "c2w": he(k2, (3, 3, 8, 16), 72),
        "c2b": jnp.zeros(16),
        "d1w": he(k3, (7 * 7 * 16, 64), 784),
        "d1b": jnp.zeros(64),
        "d2w": he(k4, (64, 10), 64),
        "d2b": jnp.zeros(10),
    }


def conv(x, w, b):
    y = jax.lax.conv_general_dilated(x, w, (1, 1), "SAME", dimension_numbers=("NHWC", "HWIO", "NHWC"))
    return y + b


def pool(x):
    return jax.lax.reduce_window(x, -jnp.inf, jax.lax.max, (1, 2, 2, 1), (1, 2, 2, 1), "VALID")


def forward(p, x):
    # x: (N, 28, 28, 1), values in [0, 1], white digit on black like MNIST.
    x = pool(jax.nn.relu(conv(x, p["c1w"], p["c1b"])))
    x = pool(jax.nn.relu(conv(x, p["c2w"], p["c2b"])))
    x = x.reshape(x.shape[0], -1)  # flattened in (row, col, channel) order
    x = jax.nn.relu(x @ p["d1w"] + p["d1b"])
    return x @ p["d2w"] + p["d2b"]


def loss_fn(p, x, y):
    logits = forward(p, x)
    return -jnp.mean(jnp.sum(jax.nn.log_softmax(logits) * jax.nn.one_hot(y, 10), axis=1))


# ---------------------------------------------------------------- augmentation
def augment_one(key, img):
    k1, k2, k3, k4, k5 = jax.random.split(key, 5)
    angle = jax.random.uniform(k1, minval=-0.25, maxval=0.25)  # about +/-14 degrees
    scale = jax.random.uniform(k2, minval=0.8, maxval=1.15)
    shift = jax.random.uniform(k3, (2,), minval=-2.5, maxval=2.5)
    shear = jax.random.uniform(k4, minval=-0.2, maxval=0.2)
    c, s = jnp.cos(angle), jnp.sin(angle)
    m = jnp.array([[c, -s], [s, c]]) @ jnp.array([[1.0, shear], [0.0, 1.0]]) / scale
    yy, xx = jnp.meshgrid(jnp.arange(28.0), jnp.arange(28.0), indexing="ij")
    coords = jnp.stack([yy.ravel() - 13.5, xx.ravel() - 13.5])
    src = m @ coords + 13.5 - shift[:, None]
    out = jax.scipy.ndimage.map_coordinates(img, [src[0], src[1]], order=1, cval=0.0).reshape(28, 28)
    # Stroke thickness: sometimes thicken (max filter), sometimes thin (min filter).
    choice = jax.random.randint(k5, (), 0, 3)
    padded = jnp.pad(out, 1)
    neigh = jnp.stack([padded[dy : dy + 28, dx : dx + 28] for dy in range(3) for dx in range(3)])
    thick = neigh.max(axis=0)
    thin = neigh.min(axis=0)
    return jnp.where(choice == 0, thick, jnp.where(choice == 1, out, 0.5 * (out + thin)))


augment = jax.jit(jax.vmap(augment_one))


def adam_step(p, m, v, g, t, lr):
    b1, b2, eps = 0.9, 0.999, 1e-8
    m = jax.tree_util.tree_map(lambda a, b: b1 * a + (1 - b1) * b, m, g)
    v = jax.tree_util.tree_map(lambda a, b: b2 * a + (1 - b2) * b * b, v, g)
    mh = jax.tree_util.tree_map(lambda a: a / (1 - b1**t), m)
    vh = jax.tree_util.tree_map(lambda a: a / (1 - b2**t), v)
    p = jax.tree_util.tree_map(lambda w, a, b: w - lr * a / (jnp.sqrt(b) + eps), p, mh, vh)
    return p, m, v


@jax.jit
def train_step(p, m, v, x, y, t, lr):
    loss, g = jax.value_and_grad(loss_fn)(p, x, y)
    p, m, v = adam_step(p, m, v, g, t, lr)
    return p, m, v, loss


@jax.jit
def predict(p, x):
    return jnp.argmax(forward(p, x), axis=1)


def accuracy(p, x, y):
    preds = np.concatenate([np.asarray(predict(p, x[i : i + 2000])) for i in range(0, len(x), 2000)])
    return float((preds == y).mean())


# ---------------------------------------------------------------- main
def main():
    x_train = load_idx("x_train").astype(np.float32) / 255.0
    y_train = load_idx("y_train").astype(np.int32)
    x_test = load_idx("x_test").astype(np.float32) / 255.0
    y_test = load_idx("y_test").astype(np.int32)
    print(f"train {x_train.shape}, test {x_test.shape}")

    key = jax.random.PRNGKey(SEED)
    key, sub = jax.random.split(key)
    p = init_params(sub)
    m = jax.tree_util.tree_map(jnp.zeros_like, p)
    v = jax.tree_util.tree_map(jnp.zeros_like, p)
    rng = np.random.default_rng(SEED)
    steps_per_epoch = len(x_train) // BATCH
    t = 0
    for epoch in range(EPOCHS):
        start = time.time()
        order = rng.permutation(len(x_train))
        lr = 2e-3 * (0.5 ** (epoch // 4))
        losses = []
        for i in range(steps_per_epoch):
            idx = order[i * BATCH : (i + 1) * BATCH]
            key, sub = jax.random.split(key)
            xb = augment(jax.random.split(sub, BATCH), jnp.asarray(x_train[idx]))[..., None]
            t += 1
            p, m, v, loss = train_step(p, m, v, xb, jnp.asarray(y_train[idx]), t, lr)
            losses.append(float(loss))
        acc = accuracy(p, x_test[..., None], y_test)
        print(f"epoch {epoch + 1}/{EPOCHS}  loss {np.mean(losses):.4f}  test accuracy {acc:.4f}  ({time.time() - start:.0f}s)")

    key, sub = jax.random.split(key)
    aug_test = np.asarray(augment(jax.random.split(sub, 10000), jnp.asarray(x_test)))
    test_acc = accuracy(p, x_test[..., None], y_test)
    aug_acc = accuracy(p, aug_test[..., None], y_test)
    print(f"final test accuracy {test_acc:.4f}; on distorted test images {aug_acc:.4f}")

    # One clear, correctly classified example per digit for the "Show an example" button.
    preds = np.concatenate([np.asarray(predict(p, x_test[i : i + 2000, ..., None])) for i in range(0, 10000, 2000)])
    examples = []
    for d in range(10):
        idx = np.where((y_test == d) & (preds == d))[0][3]
        examples.append(base64.b64encode((x_test[idx] * 255).astype(np.uint8).tobytes()).decode())

    def pack(a):
        a = np.asarray(a, dtype=np.float32)
        return {"shape": list(a.shape), "data": base64.b64encode(a.tobytes()).decode()}

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(
            {
                "description": "Small CNN trained on MNIST. Float32 little-endian, NHWC activations, HWIO conv kernels.",
                "testAccuracy": round(test_acc, 4),
                "distortedTestAccuracy": round(aug_acc, 4),
                "trainingImages": int(len(x_train)),
                "params": {k: pack(v) for k, v in p.items()},
                "examples": examples,
            },
            f,
        )
    print(f"wrote {OUT} ({os.path.getsize(OUT) / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
