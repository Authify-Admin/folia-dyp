"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, ImageIcon, X } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { PLANT_DOCTOR_POINTS } from "@/components/PlantDoctor";
import { POLICY_FACTS } from "@/lib/policies";
import { uploadPlantDoctorImage } from "@/lib/storage";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10MB

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG, PNG or WEBP).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("That image is over 10MB — please pick a smaller one.");
      return;
    }
    setPhotoError("");
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview("");
    setPhotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // The photo can't be POSTed to the Google Form directly (anonymous file
      // uploads aren't supported via no-cors), so upload it to Firebase Storage
      // and pass the link along in the message body.
      let messageBody = formData.message;
      if (photo) {
        const photoUrl = await uploadPlantDoctorImage(photo);
        messageBody += `\n\nPhoto: ${photoUrl}`;
      }

      const GOOGLE_FORM_URL =
        "https://docs.google.com/forms/d/e/1FAIpQLScOG4ge_d3-cayvh4JzqrFX84jqtSygPmgFklR-rZG0XcTmxw/formResponse";

      const googleFormData = new FormData();
      googleFormData.append("entry.1469692068", formData.name);
      googleFormData.append("entry.1987490862", formData.email);
      googleFormData.append("entry.69381457", formData.subject);
      googleFormData.append("entry.417485980", messageBody);

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
      removePhoto();
    }
  };

  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* The invitation */}
          <div className="lg:w-[45%]">
            <Reveal y={20}>
              <p className="eyebrow text-forest">Folia Plant Doctor · Free</p>
            </Reveal>
            <TextReveal
              as="h1"
              text={"Send a photo.\nA gardener answers."}
              className="font-display mt-6 text-4xl font-light leading-[1.05] tracking-[-0.015em] text-ink sm:text-6xl"
              stagger={0.06}
            />
            <Reveal delay={0.25}>
              <div className="mt-7 inline-flex items-center gap-2.5 border border-forest/30 bg-forest/5 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
                </span>
                We reply within 24 hours
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="prose-editorial mt-7 max-w-md text-ink/65">
                Our free plant-care consultation. Share a photo of the trouble —
                a yellowing leaf, a pest you can&rsquo;t place, a plant that&rsquo;s
                sulking — and a real gardener will diagnose it and tell you exactly
                what to do, usually within a day. No purchase needed.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {PLANT_DOCTOR_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-[0.9375rem] text-ink/75"
                  >
                    <Check className="h-4 w-4 shrink-0 text-forest" strokeWidth={2} />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.4}>
              <dl className="hairline-t mt-12 space-y-5 pt-8">
                <div>
                  <dt className="eyebrow text-ink/65">Email</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    <a href={POLICY_FACTS.emailHref} className="link-rule text-ink">
                      {POLICY_FACTS.email}
                    </a>
                    <span className="block text-ink/55">
                      {POLICY_FACTS.supportHours} · replies {POLICY_FACTS.replyWindow}
                    </span>
                  </dd>
                </div>
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
                  <dt className="eyebrow text-ink/65">Trade &amp; partnerships</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    Distributors, retailers, nurseries, landscapers and corporate
                    gifting — write to us and mark it &ldquo;Partnership&rdquo;.
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/65">Where to find us</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-ink/75">
                    This website, plus Amazon, garden centres and nurseries across
                    India — with free doorstep delivery, nationwide.
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
                  <div>
                    <label className="field-label">
                      Your plant&rsquo;s photo{" "}
                      <span className="font-normal normal-case tracking-normal text-ink/45">
                        (optional, but it helps)
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    {photoPreview ? (
                      <div className="relative mt-1 overflow-hidden border border-ink/15 bg-white/50">
                        {/* Plain <img>: blob: previews can't go through the Next optimizer. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreview}
                          alt="Your plant"
                          className="max-h-72 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          aria-label="Remove photo"
                          className="absolute right-3 top-3 flex items-center gap-1.5 bg-ink/70 px-3 py-1.5 text-xs font-medium text-parchment backdrop-blur transition-colors hover:bg-ink"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2} />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 flex w-full flex-col items-center justify-center border border-dashed border-ink/25 bg-white/40 px-6 py-10 text-center transition-colors hover:border-forest hover:bg-forest/5"
                      >
                        <ImageIcon
                          className="mb-3 h-9 w-9 text-ink/30"
                          strokeWidth={1.25}
                        />
                        <span className="text-[0.9375rem] font-medium text-ink/75">
                          Click to add a photo of your plant
                        </span>
                        <span className="mt-1 text-[0.8125rem] text-ink/50">
                          A clear shot of the leaf or pest helps · JPG, PNG or WEBP, up to 10MB
                        </span>
                      </button>
                    )}
                    {photoError && (
                      <p className="mt-2 text-[0.8125rem] text-clay">{photoError}</p>
                    )}
                  </div>
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
