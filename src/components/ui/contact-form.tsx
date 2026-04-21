"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/constants";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-sand/50 p-8 text-center">
        <h3 className="font-heading text-xl font-semibold text-black">
          Message sent.
        </h3>
        <p className="mt-2 text-ink-60">
          I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-salmon transition-colors hover:text-salmon-deep"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-60"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-paper px-4 py-3 text-black placeholder:text-ink-60/50 focus:border-salmon focus:outline-none focus:ring-1 focus:ring-salmon transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-60"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-paper px-4 py-3 text-black placeholder:text-ink-60/50 focus:border-salmon focus:outline-none focus:ring-1 focus:ring-salmon transition-colors"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-60"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="w-full resize-none rounded-lg border border-border bg-paper px-4 py-3 text-black placeholder:text-ink-60/50 focus:border-salmon focus:outline-none focus:ring-1 focus:ring-salmon transition-colors"
          placeholder="Tell me about your project..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-ink-90">
          {errorMessage} You can also email me at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-salmon underline underline-offset-2 hover:text-salmon-deep"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "w-full rounded-full bg-salmon px-6 py-3.5 font-heading font-medium text-white transition-all hover:bg-salmon-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-salmon",
          status === "sending" && "opacity-70 cursor-not-allowed"
        )}
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
