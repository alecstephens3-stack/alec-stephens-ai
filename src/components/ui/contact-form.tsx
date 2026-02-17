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
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="font-heading text-xl font-semibold text-white">
          Message sent!
        </h3>
        <p className="mt-2 text-warm-gray">
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-terracotta transition-colors hover:text-terracotta-light"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60"
            >
              Name <span className="text-terracotta">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60"
            >
              Email <span className="text-terracotta">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-company"
            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60"
          >
            Company <span className="text-white/30">(optional)</span>
          </label>
          <input
            id="contact-company"
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
            placeholder="Your company"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/60"
          >
            What can I help with? <span className="text-terracotta">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
            placeholder="Tell me about your project or what you're looking to automate..."
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">
          {errorMessage} You can also email me directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline hover:text-red-300"
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
          "mt-6 w-full rounded-lg bg-terracotta px-6 py-3.5 font-heading font-semibold text-white transition-all hover:bg-terracotta-light hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
          status === "sending" && "opacity-70 cursor-not-allowed hover:translate-y-0"
        )}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
