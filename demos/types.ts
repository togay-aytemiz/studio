import type React from 'react';

export type DemoDataStrategy =
  | 'sessionStorage'
  | 'localStorage'
  | 'netlifyFunction'
  | 'externalApi'
  | 'none';

export type DemoConfig = {
  slug: string;
  aliases?: string[];
  title: string;
  description?: string;
  layout: 'custom';
  dataStrategy: DemoDataStrategy;
  entry: React.ComponentType;
};
