import React from 'react';

type FooterCtaProps = {
  title: string;
  description: string;
  buttonLabel: string;
  href?: string;
};

const FooterCta: React.FC<FooterCtaProps> = ({
  title,
  description,
  buttonLabel,
  href = '/#contact',
}) => {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-slate-950">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 hidden bg-cover bg-center opacity-70 md:block md:opacity-80"
          style={{ backgroundImage: "url('/founder-desktop.webp')" }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 md:hidden"
          style={{ backgroundImage: "url('/founder-mobile.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            AGENS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-200">{description}</p>
        </div>
        <a
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
          href={href}
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  );
};

export default FooterCta;
