"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HOME_EN, type HomeCopy } from "@/lib/content";
import { Button } from "@/components/ui/button";

const LABEL_CLASS =
  "mb-2 block font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2";

const FIELD_CLASS =
  "w-full rounded-[12px] border border-rule bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink-2 transition-colors duration-[220ms] ease-brand focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export function ContactForm({ copy = HOME_EN.form }: { copy?: HomeCopy["form"] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot: a real person never sees or fills this
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
        body: JSON.stringify({ ...formData, locale: copy.locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((copy.showServerError && data.error) || copy.errorFallback);
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      // A network failure throws in the browser's language; keep the page's own.
      setErrorMessage(
        copy.showServerError && err instanceof Error ? err.message : copy.errorFallback
      );
    }
  };

  if (status === "success") {
    return (
      <div className="sai-tile rounded-tile p-8 text-center">
        <h3 className="font-heading text-xl font-medium text-ink-90">
          {copy.sentTitle}
        </h3>
        <p className="mt-3 text-base text-ink-2">
          {copy.sentBody}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-[15px] font-medium text-accent transition-colors duration-[220ms] ease-brand hover:text-accent-deep"
        >
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <div className="grid gap-5">
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>
            {copy.name}
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
            placeholder={copy.namePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL_CLASS}>
            {copy.email}
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
            placeholder={copy.emailPlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>
          {copy.message}
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
          placeholder={copy.messagePlaceholder}
        />
      </div>

      {/* Honeypot. Off-screen, unlabelled to assistive tech, never tabbable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Do not fill this in</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
        />
      </div>

      {status === "error" && (
        <p className="text-[15px] leading-relaxed text-ink-90">
          {errorMessage} {copy.errorLead}
          <a
            href={`mailto:${copy.errorEmail}`}
            className="text-accent underline underline-offset-2 hover:text-accent-deep"
          >
            {copy.errorEmail}
          </a>
          {copy.errorTail}
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
        {status === "sending" ? copy.sending : copy.send}
      </Button>
    </form>
  );
}
