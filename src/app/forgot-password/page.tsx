import Link from "next/link";
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-bold text-xl mb-3">S</div>
          <h1 className="text-xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your email to receive reset instructions</p>
        </div>
        <div className="rounded-2xl border bg-card shadow-lg p-6 space-y-4">
          <div>
            <label className="text-xs font-medium">Email address</label>
            <input type="email" placeholder="you@company.com" className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <button className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            Send Reset Instructions
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
