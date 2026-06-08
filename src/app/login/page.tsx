"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@srm.com", password: "admin123" },
  { role: "Procurement Manager", email: "procurement@srm.com", password: "proc123" },
  { role: "Finance User", email: "finance@srm.com", password: "fin123" },
  { role: "Executive", email: "executive@srm.com", password: "exec123" },
  { role: "Supplier", email: "supplier@srm.com", password: "sup123" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loginError, clearError } = useAuthStore();
  const [email, setEmail] = useState("admin@srm.com");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) router.push("/dashboard");
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    clearError();
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-bold text-2xl mb-4 shadow-lg shadow-primary/30">S</div>
          <h1 className="text-2xl font-bold text-white">SRM Portal</h1>
          <p className="text-sm text-blue-300 mt-1">Dynamics 365 Business Central</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl p-7">
          <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-blue-200/70 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-blue-100">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                className="mt-1.5 flex h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-blue-100">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError(); }}
                  className="flex h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-2 text-xs text-red-300">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" />Signing in…</> : "Sign In"}
            </button>

            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center text-xs"><span className="bg-transparent px-2 text-white/40">or sign in with</span></div></div>

            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
              <Building2 size={16} />Microsoft Account
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <p className="text-xs font-semibold text-blue-200 mb-3">Quick Demo — click to fill credentials:</p>
          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => fillDemo(acc)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors group">
                <span className="font-semibold text-white group-hover:text-primary transition-colors">{acc.role}</span>
                <span className="text-white/40">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-5">© 2024 SRM Portal · Enterprise Edition</p>
      </div>
    </div>
  );
}
