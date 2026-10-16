"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { isWhatsAppConfigured } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { contactContent } from "@/config/content";
import { Button } from "@/components/ui/Button";
/**
 * Contact form.
 *
 * IMPORTANT — this form does not pretend to submit anywhere. There is no
 * backend, no email service and no database, so instead of faking a success
 * state it composes the enquiry and hands it to WhatsApp, which the visitor
 * sends themselves. If no number is configured, the form says so plainly
 * rather than appearing to work.
 */

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "opened" | "blocked">("idle");

  const configured = isWhatsAppConfigured();

  const update = (field: keyof typeof values) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!configured) {
      setStatus("blocked");
      return;
    }

    // Build the message from only the fields the visitor actually filled in.
    const lines: string[] = ["Hello Leather Wind, I would like to enquire about your products.", ""];
    if (values.name.trim()) lines.push(`Name: ${values.name.trim()}`);
    if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`);
    if (values.phone.trim()) lines.push(`Phone: ${values.phone.trim()}`);
    if (values.message.trim()) lines.push("", "Message:", values.message.trim());

    const url = buildWhatsAppUrl(lines.join("\n"));
    if (!url) {
      setStatus("blocked");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("opened");
  };

  const inputClasses =
    "mt-2 w-full rounded-control border border-sand bg-ivory px-3.5 py-3 text-body-sm text-espresso placeholder:text-charcoal/40 focus:border-cognac focus:outline-none focus-visible:outline-none";
  const labelClasses =
    "block text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60";

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-sand bg-white p-6 sm:p-8">
      <h2 className="text-display-sm">Send an Enquiry</h2>

      <p
        id="contact-form-notice"
        className="mt-4 border-l-2 border-cognac bg-sand/40 px-4 py-3 text-body-sm text-charcoal/80"
      >
        {configured ? contactContent.formNotice : contactContent.formUnavailable}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="contact-name" className={labelClasses}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            className={inputClasses}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClasses}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            className={inputClasses}
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClasses}>
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update("phone")}
            className={inputClasses}
            placeholder="Optional"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={update("message")}
            className={inputClasses}
            placeholder="Tell us which products or specifications you are interested in."
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4">
        <Button type="submit" size="lg" variant="primary" disabled={!configured}>
          <Send aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
          Prepare WhatsApp Message
        </Button>

        <p role="status" aria-live="polite" className="text-body-sm text-charcoal/70">
          {status === "opened" ? contactContent.formSuccessHint : null}
        </p>
      </div>
    </form>
  );
}
