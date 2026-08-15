'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/actions/auth';
import { AuthForm, EmailField, PasswordField } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const fillDemoAccount = () => {
    setEmail('demo@cubecom.pro');
    setPassword('demo1234');
  };

  return (
    <AuthShell>
      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[var(--ink)]">
          Welcome back
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          Sign in to your CubeCom workspace to manage products, configuration graphs, and commerce channels.
        </p>
      </div>

      {/* Main Login Form */}
      <AuthForm action={loginAction} submitLabel="Sign in to workspace →">
        <EmailField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-0.5 text-[12px]">
          <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--line)] text-[#665CFF] accent-[#665CFF]"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[#665CFF] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </AuthForm>

      {/* Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--line)]" />
        </div>
        <span className="relative bg-[var(--surface-pure)] px-3 text-[12px] text-[var(--text-muted)]">
          or
        </span>
      </div>

      {/* SSO Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={fillDemoAccount}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors shadow-2xs"
        >
          {/* Google "G" Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={fillDemoAccount}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors shadow-2xs"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Continue with SSO</span>
        </button>
      </div>

      {/* New to CubeCom */}
      <div className="pt-1 text-[13px] text-[var(--text-secondary)]">
        <span>New to CubeCom? </span>
        <Link
          href="/register"
          className="font-medium text-[#665CFF] hover:underline inline-flex items-center gap-0.5"
        >
          <span>Create workspace</span>
          <span>›</span>
        </Link>
      </div>

      {/* Demo Account Quick Card */}
      <div
        onClick={fillDemoAccount}
        className="group flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 hover:bg-[var(--canvas)] hover:border-[#665CFF]/40 cursor-pointer transition-all shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--canvas)] text-[var(--ink)] border border-[var(--line)] font-mono text-[13px] font-bold">
            &lt;/&gt;
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[var(--ink)] group-hover:text-[#665CFF] transition-colors leading-tight">
              Use demo account
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Explore CubeCom with sample data
            </p>
          </div>
        </div>
        <span className="text-[14px] text-[var(--text-muted)] group-hover:text-[#665CFF] font-mono transition-colors">
          ›
        </span>
      </div>
    </AuthShell>
  );
}
