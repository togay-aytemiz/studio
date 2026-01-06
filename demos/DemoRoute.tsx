import React from 'react';
import { useParams } from 'react-router-dom';
import DemoRenderer from './DemoRenderer';

const DemoRoute: React.FC = () => {
  const { slug } = useParams();
  if (!slug) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-semibold">Demo secilmedi</h1>
          <p className="mt-4 text-base text-slate-600">
            /demos/:slug formatinda bir demo bekleniyor.
          </p>
        </main>
      </div>
    );
  }

  return <DemoRenderer slug={slug} />;
};

export default DemoRoute;
