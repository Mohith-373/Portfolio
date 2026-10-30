// In-browser inference for the digit-recognition CNN trained by scripts/train_digits.py.
// No ML library: the forward pass is ~60 lines of plain TypeScript.
// Layout matches the training code: activations are (height, width, channels),
// conv kernels are (kh, kw, in, out), dense weights are (in, out).

export type Tensor = { shape: number[]; data: Float32Array };

export type DigitModel = {
  params: Record<string, Tensor>;
  examples: Uint8Array[];
  testAccuracy: number;
  trainingImages: number;
};

type RawModel = {
  testAccuracy: number;
  trainingImages: number;
  params: Record<string, { shape: number[]; data: string }>;
  examples: string[];
};

function decodeBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function parseModel(raw: RawModel): DigitModel {
  const params: Record<string, Tensor> = {};
  for (const [name, t] of Object.entries(raw.params)) {
    const bytes = decodeBase64(t.data);
    params[name] = { shape: t.shape, data: new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4) };
  }
  return {
    params,
    examples: raw.examples.map(decodeBase64),
    testAccuracy: raw.testAccuracy,
    trainingImages: raw.trainingImages,
  };
}

// 3x3 convolution, stride 1, "same" padding, followed by ReLU.
function convRelu(input: Float32Array, size: number, cin: number, w: Tensor, b: Tensor): Float32Array {
  const cout = w.shape[3];
  const out = new Float32Array(size * size * cout);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      for (let o = 0; o < cout; o++) {
        let sum = b.data[o];
        for (let ky = 0; ky < 3; ky++) {
          const iy = y + ky - 1;
          if (iy < 0 || iy >= size) continue;
          for (let kx = 0; kx < 3; kx++) {
            const ix = x + kx - 1;
            if (ix < 0 || ix >= size) continue;
            const inBase = (iy * size + ix) * cin;
            const wBase = ((ky * 3 + kx) * cin) * cout + o;
            for (let c = 0; c < cin; c++) sum += input[inBase + c] * w.data[wBase + c * cout];
          }
        }
        out[(y * size + x) * cout + o] = sum > 0 ? sum : 0;
      }
    }
  }
  return out;
}

// 2x2 max pooling, stride 2.
function maxPool(input: Float32Array, size: number, ch: number): Float32Array {
  const half = size / 2;
  const out = new Float32Array(half * half * ch);
  for (let y = 0; y < half; y++) {
    for (let x = 0; x < half; x++) {
      for (let c = 0; c < ch; c++) {
        let m = -Infinity;
        for (let dy = 0; dy < 2; dy++)
          for (let dx = 0; dx < 2; dx++) m = Math.max(m, input[((y * 2 + dy) * size + (x * 2 + dx)) * ch + c]);
        out[(y * half + x) * ch + c] = m;
      }
    }
  }
  return out;
}

function dense(input: Float32Array, w: Tensor, b: Tensor, relu: boolean): Float32Array {
  const [nin, nout] = w.shape;
  const out = new Float32Array(nout);
  for (let o = 0; o < nout; o++) {
    let sum = b.data[o];
    for (let i = 0; i < nin; i++) sum += input[i] * w.data[i * nout + o];
    out[o] = relu && sum < 0 ? 0 : sum;
  }
  return out;
}

/** Returns the probability of each digit 0-9 for a 28x28 image (values 0-1, white digit on black). */
export function classify(model: DigitModel, image: Float32Array): number[] {
  const p = model.params;
  let x = convRelu(image, 28, 1, p.c1w, p.c1b);
  x = maxPool(x, 28, 8);
  x = convRelu(x, 14, 8, p.c2w, p.c2b);
  x = maxPool(x, 14, 16);
  x = dense(x, p.d1w, p.d1b, true);
  const logits = dense(x, p.d2w, p.d2b, false);
  const max = Math.max(...logits);
  const exps = Array.from(logits, (v) => Math.exp(v - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / total);
}

/**
 * Turn a drawing into an MNIST-style 28x28 image: crop to the ink, scale the longest
 * side to 20px (keeping its shape), then centre by the centre of mass, the same way
 * the MNIST images were prepared. `ink` is a square greyscale array (0-1) of side `size`.
 */
export function toMnist(ink: Float32Array, size: number): Float32Array | null {
  let minX = size, minY = size, maxX = -1, maxY = -1;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (ink[y * size + x] > 0.05) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  if (maxX < 0) return null;

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const scale = 20 / Math.max(w, h);
  const sw = Math.max(1, Math.round(w * scale));
  const sh = Math.max(1, Math.round(h * scale));

  // Area-average downsample of the cropped box into sw x sh.
  const small = new Float32Array(sw * sh);
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const x0 = minX + (x * w) / sw, x1 = minX + ((x + 1) * w) / sw;
      const y0 = minY + (y * h) / sh, y1 = minY + ((y + 1) * h) / sh;
      let sum = 0, area = 0;
      for (let yy = Math.floor(y0); yy < Math.ceil(y1); yy++) {
        const fy = Math.min(yy + 1, y1) - Math.max(yy, y0);
        for (let xx = Math.floor(x0); xx < Math.ceil(x1); xx++) {
          const fx = Math.min(xx + 1, x1) - Math.max(xx, x0);
          sum += ink[yy * size + xx] * fx * fy;
          area += fx * fy;
        }
      }
      small[y * sw + x] = area > 0 ? Math.min(1, sum / area) : 0;
    }
  }

  // Centre of mass of the scaled digit.
  let mass = 0, cx = 0, cy = 0;
  for (let y = 0; y < sh; y++)
    for (let x = 0; x < sw; x++) {
      const v = small[y * sw + x];
      mass += v;
      cx += v * x;
      cy += v * y;
    }
  cx /= mass;
  cy /= mass;

  const out = new Float32Array(28 * 28);
  const offX = Math.round(14 - cx - 0.5);
  const offY = Math.round(14 - cy - 0.5);
  for (let y = 0; y < sh; y++)
    for (let x = 0; x < sw; x++) {
      const tx = x + offX, ty = y + offY;
      if (tx >= 0 && tx < 28 && ty >= 0 && ty < 28) out[ty * 28 + tx] = small[y * sw + x];
    }
  return out;
}
