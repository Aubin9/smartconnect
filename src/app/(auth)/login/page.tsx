"use client";

import { Activity, ArrowLeft, LayoutDashboard, Smartphone } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@smartconnect.cm");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(
        "Invalid email or password. Use seeded credentials from README.",
      );
      return;
    }
    router.push(params.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  }

  // FIXED: Renamed from useDemo to handleSelectDemo to satisfy ESLint
  function handleSelectDemo(account: "admin" | "operator" | "subscriber") {
    const map = {
      admin: "admin@smartconnect.cm",
      operator: "operator@smartconnect.cm",
      subscriber: "subscriber1@smartconnect.cm",
    } as const;
    setEmail(map[account]);
    setPassword("Password123!");
  }

  return (
    <main className="grid min-h-screen bg-gradient-to-br from-brand-navy via-brand-blue to-brand-teal p-4 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden flex-col justify-between rounded-[2rem] border border-white/20 bg-white/10 p-8 text-white backdrop-blur lg:flex">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to landing page
          </Link>
          <div className="mt-16 max-w-xl">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20">
              <Activity className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-black leading-tight">
              Access SmartConnect.
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/80">
              Operators enter the command center, while subscribers are
              redirected to the mobile-responsive portal. Use the demo accounts
              below for quick testing.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/login?callbackUrl=/dashboard"
            className="rounded-3xl bg-white/10 p-5 transition hover:bg-white/20"
          >
            <LayoutDashboard className="mb-3 h-6 w-6" />
            <p className="font-black">Operator dashboard</p>
            <p className="mt-1 text-sm text-white/70">
              Network, analytics, finance and ML monitoring.
            </p>
          </Link>
          <Link
            href="/login?callbackUrl=/mobile"
            className="rounded-3xl bg-white/10 p-5 transition hover:bg-white/20"
          >
            <Smartphone className="mb-3 h-6 w-6" />
            <p className="font-black">Subscriber portal</p>
            <p className="mt-1 text-sm text-white/70">
              Wallet, quality scanner, alerts and profile.
            </p>
          </Link>
        </div>
      </section>

      <section className="flex items-center justify-center py-8">
        <Card className="w-full max-w-md border-white/20 bg-white/95 p-7 shadow-soft dark:bg-slate-950/95">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-blue to-brand-teal text-white">
              <Activity className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">
              Welcome to SmartConnect
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Login to the operator dashboard or subscriber responsive portal.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
            <Button disabled={loading} className="w-full" size="lg">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-bold">Demo accounts</p>
            <div className="mt-3 grid gap-2">
              {/* FIXED: onClick event listeners updated below */}
              <button
                type="button"
                onClick={() => handleSelectDemo("admin")}
                className="rounded-xl bg-white p-3 text-left transition hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800"
              >
                <span className="block font-black">Admin</span>
                <span className="mono text-xs">
                  admin@smartconnect.cm / Password123!
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemo("operator")}
                className="rounded-xl bg-white p-3 text-left transition hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800"
              >
                <span className="block font-black">Operator</span>
                <span className="mono text-xs">
                  operator@smartconnect.cm / Password123!
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemo("subscriber")}
                className="rounded-xl bg-white p-3 text-left transition hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800"
              >
                <span className="block font-black">Subscriber</span>
                <span className="mono text-xs">
                  subscriber1@smartconnect.cm / Password123!
                </span>
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-center">
            <span>No account?</span>
            <Link href="/register" className="font-bold text-brand-blue">
              Create one
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/"
              className="font-bold text-slate-600 dark:text-slate-300"
            >
              Landing page
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
