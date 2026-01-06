import React from 'react';
import Footer from '../../components/Footer';
import FooterCta from '../../components/FooterCta';

const TryOnDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Virtual Try On
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Try On Demo</h1>
          </div>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium"
            type="button"
          >
            Preview Flow
          </button>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-10">
          <h2 className="text-lg font-semibold">Camera / Model Area</h2>
          <p className="mt-3 text-sm text-slate-600">
            Burasi try-on deneyimi icin camera veya model goruntusu olacak alan.
          </p>
          <div className="mt-8 flex h-64 items-center justify-center rounded-2xl bg-white text-sm text-slate-400">
            Placeholder
          </div>
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-base font-semibold">Product Controls</h3>
          <p className="mt-2 text-sm text-slate-600">
            Renk, beden, ve overlay ayarlari burada yer alacak.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-500">
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              Outfit A
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              Outfit B
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              Outfit C
            </div>
          </div>
        </aside>
      </main>
      <FooterCta
        title="Markaniz icin de bunun gibi bir sey yapabiliriz."
        description="Markaniza ozel, urun odakli yazilim hizmeti icin bize ulasin."
        buttonLabel="Görüşme Planla"
      />
      <Footer />
    </div>
  );
};

export default TryOnDemo;
