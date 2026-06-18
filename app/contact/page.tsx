"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * The correspondence desk. The form still posts to the existing
 * Google Form (no-cors) — same capture path, new manners.
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const GOOGLE_FORM_URL =
        "https://docs.google.com/forms/d/e/1FAIpQLScOG4ge_d3-cayvh4JzqrFX84jqtSygPmgFklR-rZG0XcTmxw/formResponse";

      const googleFormData = new FormData();
      googleFormData.append("entry.1469692068", formData.name);
      googleFormData.append("entry.1987490862", formData.email);
      googleFormData.append("entry.69381457", formData.subject);
      googleFormData.append("entry.417485980", formData.message);

      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        body: googleFormData,
        mode: "no-cors",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* The invitation */}
          <div className="lg:w-[45%]">
            <Reveal y={20}>
              <p className="eyebrow text-forest">Contact</p>
            </Reveal>
            <TextReveal
              as="h1"
              text={"Write to us.\nGardeners answer."}
              className="font-display mt-6 text-4xl font-light leading-[1.05] tracking-[-0.015em] text-ink sm:text-6xl"
              stagger={0.06}
            />
            <Reveal delay={0.3}>
              <p className="prose-editorial mt-8 max-w-md text-ink/65">
                A yellowing leaf you can&rsquo;t diagnose, a question about an
                order, or advice on what your balcony needs first — send it
                over. Real people read these, usually with soil under their
                fingernails.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <dl className="hairline-t mt-12 space-y-5 pt-8">
                <div>
                  <dt className="eyebrow text-ink/65">Orders & returns</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    Track any order from the{" "}
                    <a href="/track-order" className="link-rule text-ink">
                      track order
                    </a>{" "}
                    page — order number and email is all it takes.
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/65">Call or text</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    <a href="tel:+919008627070" className="link-rule text-ink">
                      +91 90086 27070
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/65">Instagram</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    <a
                      href="https://www.instagram.com/my_folia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-rule text-ink"
                    >
                      @my_folia
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/65">Growing in</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    India — free doorstep delivery, nationwide.
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* The form */}
          <div className="lg:w-[55%]">
            <Reveal delay={0.2}>
              {submitted ? (
                <div className="flex min-h-[24rem] flex-col items-start justify-center border border-forest/30 bg-forest/5 p-10">
                  <p className="eyebrow text-forest">Received</p>
                  <p className="font-display mt-5 text-3xl font-light leading-snug text-ink">
                    Your note is in good hands.
                    <br />
                    <em className="text-forest">We&rsquo;ll write back soon.</em>
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost-ink mt-9"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="field-label">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        placeholder="Asha Iyer"
                        className="field-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="field-label">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="asha@example.com"
                        className="field-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="field-label">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="My monstera and I have questions"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="field-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us everything — light, watering, what changed…"
                      className="field-input resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-clay group w-full sm:w-auto"
                  >
                    {isSubmitting ? "Sending…" : "Send the note"}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
