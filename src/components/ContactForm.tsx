"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { site } from "@/content/site";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "opened" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Enter your name.";
  if (!fields.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(fields.email.trim())) errors.email = "Enter an email address like name@example.com.";
  if (!fields.subject.trim()) errors.subject = "Enter a subject.";
  if (fields.message.trim().length < 10) errors.message = "Write a message of at least 10 characters.";
  return errors;
}

// With contactFormEndpoint set (e.g. Formspree), the form posts the message.
// Without it, the form opens the visitor's email app with the message filled in,
// and the button says so: nothing pretends to send.
export function ContactForm() {
  const endpoint = site.contactFormEndpoint;
  const [fields, setFields] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    if (!endpoint) {
      const body = `${fields.message.trim()}\n\n${fields.name.trim()}\n${fields.email.trim()}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(fields.subject.trim())}&body=${encodeURIComponent(body)}`;
      setStatus("opened");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      setStatus("sent");
      setFields({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "mt-1.5 block w-full rounded-md border bg-surface px-3 py-2.5 text-[0.9375rem] text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

  const field = (key: keyof Fields, label: string, type: "text" | "email" | "textarea", autoComplete?: string) => {
    const id = `contact-${key}`;
    const errorId = `${id}-error`;
    const common = {
      id,
      name: key,
      value: fields[key],
      autoComplete,
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? errorId : undefined,
      className: `${inputClass} ${errors[key] ? "border-red-500/70" : "border-line-strong"}`,
    };
    return (
      <div className={type === "textarea" ? "sm:col-span-2" : undefined}>
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea {...common} rows={5} onChange={(e) => update(key, e.target.value)} />
        ) : (
          <input {...common} type={type} onChange={(e) => update(key, e.target.value)} />
        )}
        {errors[key] ? (
          <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors[key]}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-xl border border-line bg-surface p-6 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", "text", "name")}
        {field("email", "Email", "email", "email")}
        <div className="sm:col-span-2">{field("subject", "Subject", "text")}</div>
        {field("message", "Message", "textarea")}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {endpoint ? (status === "sending" ? "Sending message…" : "Send message") : "Open in email app"}
        </button>
        {!endpoint ? (
          <p className="text-sm text-muted">This opens your email app with the message filled in.</p>
        ) : null}
      </div>

      <div role="status" aria-live="polite" className="empty:hidden mt-5">
        {status === "sent" ? (
          <Notice tone="ok">Message sent. I&apos;ll reply to the email address you gave as soon as I can.</Notice>
        ) : null}
        {status === "opened" ? (
          <Notice tone="ok">
            Your email app should now be open with the message ready to send. If nothing opened, email me at{" "}
            <a className="underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </Notice>
        ) : null}
        {status === "error" ? (
          <Notice tone="error">
            Your message didn&apos;t send. Check your connection and try again, or email me at{" "}
            <a className="underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </Notice>
        ) : null}
      </div>
    </form>
  );
}

function Notice({ tone, children }: { tone: "ok" | "error"; children: React.ReactNode }) {
  const Icon = tone === "ok" ? CircleCheck : CircleAlert;
  return (
    <p
      className={`flex gap-2.5 rounded-md p-3 text-sm leading-relaxed ${
        tone === "ok" ? "bg-accent-soft text-fg" : "bg-red-500/10 text-red-700 dark:text-red-300"
      }`}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${tone === "ok" ? "text-accent" : ""}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
