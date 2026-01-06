import type { DemoConfig } from './types';
import TryOnDemo from './tryon/TryOnDemo';

const demos: DemoConfig[] = [
  {
    slug: 'tryon',
    aliases: ['vto'],
    title: 'Virtual Try On',
    description: 'Interactive virtual try-on demo.',
    layout: 'custom',
    dataStrategy: 'none',
    entry: TryOnDemo,
  },
];

export const getDemoBySlug = (slug: string): DemoConfig | undefined => {
  const normalized = slug.trim().toLowerCase();
  return demos.find((demo) => {
    if (demo.slug === normalized) {
      return true;
    }
    return demo.aliases?.includes(normalized);
  });
};

export const listDemoSlugs = (): string[] =>
  demos.flatMap((demo) => [demo.slug, ...(demo.aliases ?? [])]);
