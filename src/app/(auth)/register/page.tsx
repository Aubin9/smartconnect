"use client";

import { ArrowLeft, Building2, CheckCircle2, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/helpers";

type Role = "SUBSCRIBER" | "OPERATOR";
export const dynamic = "force-dynamic";
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "23769",
    password: "",
    role: "SUBSCRIBER" as Role,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Registration failed");
      return;
    }
    setSuccess("Account created successfully. Redirecting to login...");
    setTimeout(
      () =>
        router.push(
          `/login?callbackUrl=${form.role === "SUBSCRIBER" ? "/mobile" : "/dashboard"}`,
        ),
      900,
    );
  }

  function setRole(role: Role) {
    setForm((current) => ({ ...current, role }));
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 dark:bg-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-gradient-to-br from-brand-navy via-brand-blue to-brand-teal p-7 text-white shadow-soft">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to landing page
          </Link>
          <div className="mt-14 max-w-lg">
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Create the right SmartConnect access.
            </h1>
            <p className="mt-5 leading-7 text-white/75">
              Register as a subscriber to test the responsive mobile portal, or
              as an operator to access the command center. This makes navigation
              clear for every project evaluator.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            {[
              "Subscriber accounts open the Home, Quality, Wallet, Alerts and Profile screens.",
              "Operator accounts open the dashboard, maps, subscriber analytics, finance and ML pages.",
              "After registration, the login page sends users to the correct area automatically.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl bg-white/10 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm font-semibold text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Card className="w-full max-w-xl p-7">
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">
              Register for SmartConnect
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose the user type before filling the form.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("SUBSCRIBER")}
                className={cn(
                  "rounded-3xl border p-4 text-left transition",
                  form.role === "SUBSCRIBER"
                    ? "border-brand-blue bg-brand-blue text-white shadow-card"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900",
                )}
              >
                <Smartphone className="mb-3 h-6 w-6" />
                <p className="font-black">Subscriber</p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    form.role === "SUBSCRIBER"
                      ? "text-white/75"
                      : "text-slate-500",
                  )}
                >
                  Mobile-responsive customer portal.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRole("OPERATOR")}
                className={cn(
                  "rounded-3xl border p-4 text-left transition",
                  form.role === "OPERATOR"
                    ? "border-brand-teal bg-brand-teal text-white shadow-card"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900",
                )}
              >
                <Building2 className="mb-3 h-6 w-6" />
                <p className="font-black">Operator</p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    form.role === "OPERATOR"
                      ? "text-white/75"
                      : "text-slate-500",
                  )}
                >
                  Desktop network operations dashboard.
                </p>
              </button>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
              <Input
                placeholder="Phone number / MSISDN"
                value={form.phoneNumber}
                onChange={(event) =>
                  setForm({ ...form, phoneNumber: event.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Password, minimum 8 characters"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
              {error && (
                <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                  {success}
                </p>
              )}
              <Button disabled={loading} className="w-full" size="lg">
                {loading
                  ? "Creating account..."
                  : `Register as ${form.role === "SUBSCRIBER" ? "Subscriber" : "Operator"}`}
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link href="/login" className="font-bold text-brand-blue">
                Sign in
              </Link>
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
