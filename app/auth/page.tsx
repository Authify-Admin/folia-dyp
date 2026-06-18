"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * The members' entrance. Same auth flow (/api/auth/login, /api/auth/signup,
 * login(data.user) → /profile), set in the atelier's manner.
 */
export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        mode === "login" ? { email, password } : { email, password, name };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || (mode === "login" ? "Login failed" : "Signup failed")
        );
      }

      login(data.user);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-parchment px-5 py-32">
      <div className="w-full max-w-md">
        <Reveal y={16}>
          <p className="eyebrow text-forest">
            {mode === "login" ? "Welcome back" : "Join us"}
          </p>
        </Reveal>
        <TextReveal
          as="h1"
          text={mode === "login" ? "Good to see you again." : "Let's get you planted."}
          className="font-display mt-5 text-4xl font-light leading-[1.08] text-ink sm:text-5xl"
        />

        {/* Mode switch — two quiet tabs */}
        <Reveal delay={0.2}>
          <div className="hairline-b mt-10 flex gap-8 pb-3" role="tablist">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`text-[0.75rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  mode === m ? "text-ink" : "text-ink/65 hover:text-ink/65"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          {error && (
            <p
              role="alert"
              className="mt-6 border border-clay/40 bg-clay/5 px-5 py-3.5 text-sm text-clay-deep"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="field-label">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  disabled={loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Asha Iyer"
                  className="field-input"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  className="field-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink/65 transition-colors hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-2 text-xs text-ink/65">
                  At least 8 characters, with an uppercase letter, a lowercase
                  letter and a number.
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-clay w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                  {mode === "login" ? "Signing in" : "Creating account"}
                </>
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="hairline-t mt-8 pt-6 text-center text-xs leading-relaxed text-ink/65">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-ink">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              privacy policy
            </Link>
            . Your password is encrypted and stored securely.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
