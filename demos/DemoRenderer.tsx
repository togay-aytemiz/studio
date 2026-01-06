import React from 'react';
import { getDemoBySlug, listDemoSlugs } from './registry';

type DemoRendererProps = {
  slug: string;
};

const DemoRenderer: React.FC<DemoRendererProps> = ({ slug }) => {
  const demo = getDemoBySlug(slug);
  if (!demo) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-semibold">Demo bulunamadi</h1>
          <p className="mt-4 text-base text-slate-600">
            "{slug}" icin bir demo yok. Mevcut demo sluglari:
            {' '}
            {listDemoSlugs().join(', ')}.
          </p>
        </main>
      </div>
    );
  }

  const Entry = demo.entry;
  return <Entry />;
};

export default DemoRenderer;
