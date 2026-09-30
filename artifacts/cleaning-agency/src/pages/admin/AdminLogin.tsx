import { useState, type FormEvent } from 'react';
import { useLoginAdmin } from '@workspace/api-client-react';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AdminLoginProps = {
  configured?: boolean;
  onLogin?: () => void;
  params?: unknown;
};

export default function AdminLogin({ configured, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const login = useLoginAdmin();
  const [, setLocation] = useLocation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowError(false);
    login.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          setPassword('');
          onLogin?.();
          setLocation('/admin');
        },
        onError: () => setShowError(true),
      },
    );
  };

  return (
    <main className="relative isolate flex min-h-[100dvh] items-stretch overflow-hidden bg-[#f4f5ef] text-[#182f39]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-36 h-[32rem] w-[32rem] rounded-full border border-[#b7cfc6]/50" />
        <div className="absolute -right-24 -top-20 h-[25rem] w-[25rem] rounded-full border border-[#b7cfc6]/40" />
        <div className="absolute -bottom-48 left-[42%] h-[30rem] w-[30rem] rounded-full bg-[#dce9e1]/65 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col lg:flex-row">
        <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#183943] px-7 py-8 text-[#f4f5ef] sm:px-12 sm:py-10 lg:min-h-[100dvh] lg:w-[43%] lg:px-16 lg:py-14">
          <div aria-hidden="true" className="absolute inset-0 opacity-70">
            <div className="absolute -right-24 top-12 h-72 w-72 rounded-full border border-[#8db7a7]/30" />
            <div className="absolute -right-10 top-26 h-52 w-52 rounded-full border border-[#8db7a7]/25" />
            <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#2c5960]/45" />
            <div className="absolute bottom-16 right-12 h-2 w-24 rotate-[-38deg] bg-[#bed4c8]/60" />
            <div className="absolute bottom-24 right-8 h-2 w-16 rotate-[-38deg] bg-[#bed4c8]/35" />
          </div>
          <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#edf3ed]/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8d3c4]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to TJ FreshSpace
          </Link>

          <div className="relative z-10 mt-12 max-w-lg lg:mt-0">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c5ddce]/20 bg-[#c5ddce]/10">
              <ShieldCheck className="h-6 w-6 text-[#c5ddce]" aria-hidden="true" />
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#b8d3c4]">The space behind the work</p>
            <h1 className="max-w-md font-serif text-4xl font-medium leading-[1.06] tracking-[-0.04em] text-[#f4f5ef] sm:text-5xl">
              A good space starts behind the scenes.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-[#e5ece5]/75">
              Sign in to keep your public site clear, current, and ready for the people who make every space feel cared for.
            </p>
          </div>

          <div className="relative z-10 mt-12 flex items-center gap-3 text-sm text-[#d8e5dc]/65 lg:mt-0">
            <span className="h-px w-9 bg-[#a9c8b5]/70" />
            TJ FreshSpace · Admin
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-9">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#dce9e1] text-[#28545a]">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#638077]">Private access</p>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#183943]">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-[#647a79]">Enter your admin password to continue.</p>
            </div>

            {configured === false && (
              <div role="status" data-testid="notice-admin-not-configured" className="mb-5 flex gap-3 rounded-xl border border-[#d5dfd7] bg-[#edf2eb] p-4 text-sm leading-5 text-[#45605b]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>Admin access is being prepared. If you expected to sign in, contact your site administrator.</p>
              </div>
            )}

            {showError && (
              <div role="alert" data-testid="status-invalid-login" className="mb-5 rounded-xl border border-[#e9c8bd] bg-[#fbefea] px-4 py-3 text-sm leading-5 text-[#8d4435]">
                That password didn’t match. Check it and try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-semibold text-[#29434a]">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#78908a]" aria-hidden="true" />
                  <Input
                    id="admin-password"
                    data-testid="input-admin-password"
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (showError) setShowError(false);
                    }}
                    placeholder="Your admin password"
                    className="h-12 rounded-xl border-[#d6dfd9] bg-[#fbfcf8] pl-10 text-[#203a41] placeholder:text-[#98a8a1] focus-visible:ring-[#4d7a70]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                data-testid="button-admin-login"
                disabled={configured === false || login.isPending || !password}
                className="group h-12 w-full rounded-xl bg-[#1d454d] text-sm font-semibold text-[#f5f6ef] shadow-[0_8px_20px_-10px_rgba(24,57,67,0.65)] transition-all hover:bg-[#285962] disabled:cursor-not-allowed disabled:opacity-65"
              >
                {login.isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#e3eee6]/40 border-t-[#e3eee6]" aria-hidden="true" />
                    Checking access…
                  </>
                ) : (
                  <>
                    Sign in securely
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-7 flex items-start gap-2.5 text-xs leading-5 text-[#7b8e88]">
              <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              This area is for authorised TJ FreshSpace administrators only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}