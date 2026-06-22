"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userOperations } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * The members' entrance — passwordless, phone (SMS OTP) sign-in via Firebase.
 * phone → 6-digit code → (name, first time only). On success we resolve the
 * Firestore `users` doc by phone and hand it to AuthContext's login(), keeping
 * the existing localStorage session model. Email is no longer a credential.
 */
export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<"phone" | "code" | "name">("phone");
  const [phone, setPhone] = useState(""); // 10-digit national number
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const phoneE164Ref = useRef("");

  const resetRecaptcha = () => {
    try {
      recaptchaRef.current?.clear();
    } catch {
      /* no-op */
    }
    recaptchaRef.current = null;
  };

  // Lazily build an invisible reCAPTCHA verifier (required by Firebase phone auth).
  const getRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return recaptchaRef.current;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    const e164 = `+91${digits}`;

    setLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        e164,
        getRecaptcha()
      );
      confirmationRef.current = confirmation;
      phoneE164Ref.current = e164;
      setCode("");
      setStep("code");
    } catch (err: any) {
      console.error("send code error:", err);
      resetRecaptcha();
      if (err?.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a little and try again.");
      } else if (err?.code === "auth/invalid-phone-number") {
        setError("That mobile number doesn't look right.");
      } else {
        setError("Couldn't send the code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!confirmationRef.current) {
      setError("Your session expired. Please request a new code.");
      setStep("phone");
      return;
    }
    if (code.replace(/\D/g, "").length !== 6) {
      setError("Enter the 6-digit code we sent you.");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationRef.current.confirm(code.trim());
      const verifiedPhone = result.user.phoneNumber || phoneE164Ref.current;

      const existing = await userOperations.getByPhone(verifiedPhone);
      if (existing) {
        await userOperations.updateLastLogin(existing.id);
        login(existing);
        router.push("/profile");
        return;
      }
      // New number — collect a name before creating the account.
      setStep("name");
    } catch (err: any) {
      console.error("verify code error:", err);
      if (err?.code === "auth/invalid-verification-code") {
        setError("That code isn't right. Please check and try again.");
      } else if (err?.code === "auth/code-expired") {
        setError("That code expired. Please request a new one.");
      } else {
        setError("Couldn't verify the code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please tell us your name.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const userId = await userOperations.create({
        name: name.trim(),
        phone: phoneE164Ref.current,
        // Phone accounts carry no email/password credential.
        email: "",
        password: "",
        createdAt: now,
        lastLogin: now,
      });
      const user = await userOperations.getById(userId);
      if (!user) throw new Error("Account creation failed");
      login(user);
      router.push("/profile");
    } catch (err: any) {
      console.error("create account error:", err);
      setError("Couldn't finish setting up your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const changeNumber = () => {
    resetRecaptcha();
    confirmationRef.current = null;
    setCode("");
    setError("");
    setStep("phone");
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-parchment px-5 py-32">
      <div className="w-full max-w-md">
        <Reveal y={16}>
          <p className="eyebrow text-forest">
            {step === "name" ? "One last thing" : "Welcome"}
          </p>
        </Reveal>
        <TextReveal
          as="h1"
          text={
            step === "phone"
              ? "Sign in with your phone."
              : step === "code"
              ? "Enter your code."
              : "What should we call you?"
          }
          className="font-display mt-5 text-4xl font-light leading-[1.08] text-ink sm:text-5xl"
        />

        <Reveal delay={0.25}>
          {error && (
            <p
              role="alert"
              className="mt-8 border border-clay/40 bg-clay/5 px-5 py-3.5 text-sm text-clay-deep"
            >
              {error}
            </p>
          )}

          {/* Step 1 — phone */}
          {step === "phone" && (
            <form onSubmit={handleSendCode} className="mt-8 space-y-6">
              <div>
                <label htmlFor="phone" className="field-label">
                  Mobile number
                </label>
                <div className="flex items-stretch">
                  <span className="flex select-none items-center border border-r-0 border-ink/20 bg-white/40 px-4 text-[0.9375rem] text-ink/70">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    disabled={loading}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    autoComplete="tel-national"
                    placeholder="90086 27070"
                    className="field-input flex-1"
                  />
                </div>
                <p className="mt-2 text-xs text-ink/65">
                  We&rsquo;ll text you a 6-digit code. Standard rates may apply.
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-clay w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Sending code
                  </>
                ) : (
                  <>
                    Send code
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2 — code */}
          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="mt-8 space-y-6">
              <div>
                <label htmlFor="code" className="field-label">
                  6-digit code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  required
                  autoFocus
                  disabled={loading}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  autoComplete="one-time-code"
                  placeholder="123456"
                  className="field-input tracking-[0.5em]"
                />
                <p className="mt-2 text-xs text-ink/65">
                  Sent to +91 {phone}.{" "}
                  <button
                    type="button"
                    onClick={changeNumber}
                    className="underline transition-colors hover:text-ink"
                  >
                    Change number
                  </button>
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-clay w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Verifying
                  </>
                ) : (
                  <>
                    Verify &amp; continue
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 3 — name (new accounts only) */}
          {step === "name" && (
            <form onSubmit={handleCompleteProfile} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="field-label">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  disabled={loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Asha Iyer"
                  className="field-input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-clay w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Creating account
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="hairline-t mt-8 pt-6 text-center text-xs leading-relaxed text-ink/65">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-ink">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              privacy policy
            </Link>
            .
          </p>
        </Reveal>

        {/* Invisible reCAPTCHA mount point (required by Firebase phone auth). */}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
