"use client";

import Link from "next/link";

export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="grid min-h-screen bg-paper px-6 py-10 text-ink lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden rounded-lg bg-[#10241e] p-10 text-white lg:grid lg:content-between">
        <div>
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-linear-to-br from-gold to-[#f0c66a] font-black text-[#10241e]">G</span>
            <span>
              <strong className="block">Greenfield College</strong>
              <small className="text-white/65">Secure school portal</small>
            </span>
          </Link>
        </div>
        <div>
          <h1 className="max-w-xl text-[clamp(2.2rem,4vw,4.6rem)] leading-[0.98] text-white">{title}</h1>
          <p className="mt-5 max-w-lg text-base leading-[1.7] text-white/70">{subtitle}</p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-xl content-center py-10">
        <div className="rounded-lg border border-line bg-surface p-6 shadow-school">
          <div className="mb-6">
            <Link className="text-sm font-bold text-emerald-dark" href="/">Back to school site</Link>
            <h2 className="mt-4 text-3xl font-black leading-tight">{title}</h2>
            <p className="mt-2 text-sm leading-[1.6] text-muted">{subtitle}</p>
          </div>
          {children}
          {footer && <div className="mt-5 text-sm text-muted">{footer}</div>}
        </div>
      </section>
    </main>
  );
}

export function FieldError({ children }) {
  return children ? <p className="mt-1 text-sm font-semibold text-coral">{children}</p> : null;
}
