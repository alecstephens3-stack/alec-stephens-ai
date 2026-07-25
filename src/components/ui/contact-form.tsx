"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const LABEL_CLASS =
  "mb-2 block font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2";

const FIELD_CLASS =
  "w-full rounded-[12px] border border-rule bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink-2/70 transition-colors duration-[220ms] ease-brand focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="sai-tile rounded-tile p-8 text-center">
        <h3 className="font-heading text-xl font-medium text-ink-90">
          Message sent.
        </h3>
        <p className="mt-3 text-base text-ink-2">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-[15px] font-medium text-accent transition-colors duration-[220ms] ease-brand hover:text-accent-deep"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5">
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>
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
            className={FIELD_CLASS}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL_CLASS}>
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
            className={FIELD_CLASS}
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>
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
          className={cn(FIELD_CLASS, "resize-none")}
          placeholder="Tell us about your project..."
        />
      </div>

      {status === "error" && (
        <p className="text-[15px] leading-relaxed text-ink-90">
          {errorMessage} You can also email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline underline-offset-2 hover:text-accent-deep"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <Button
        variant="primary"
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "w-full justify-center",
          status === "sending" && "cursor-not-allowed opacity-70"
        )}
      >
        {status === "sending" ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
