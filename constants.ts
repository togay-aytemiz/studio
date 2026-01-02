import { Layers, Smartphone, Rocket, Lightbulb, Code2, Cpu, Globe, Zap } from 'lucide-react';
import { ServiceItem, ProcessStep, ProjectItem, NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Expertise', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
  { label: 'Team', href: '#team' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'strategy',
    title: 'Product Strategy',
    description: 'We help define the right product, features, and roadmap before writing code.',
    icon: Layers,
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Scalable, high-performance web applications built with Next.js, React, and Node.js.',
    icon: Globe,
  },
  {
    id: 'mobile-dev',
    title: 'Mobile Development',
    description: 'Native-feel iOS and Android applications crafted with React Native and modern tools.',
    icon: Smartphone,
  },
  {
    id: 'mvp',
    title: 'MVP & Launch',
    description: 'Fast validation, lean development, and smooth product launches for startups.',
    icon: Rocket,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Discover',
    description: 'We dive deep to understand the problem, market, and core business goals.',
  },
  {
    id: 2,
    title: 'Design',
    description: 'Architecting the user experience and crafting a stunning visual interface.',
  },
  {
    id: 3,
    title: 'Build',
    description: 'Writing clean, scalable code using modern frameworks and best practices.',
  },
  {
    id: 4,
    title: 'Launch & Iterate',
    description: 'Deploying to production and improving based on real user data.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'lumiso-crm',
    title: 'Lumiso CRM',
    category: 'B2B SaaS Platformu',
    outcome: '',
    imageUrl: '/Lumiso.webp',
    projectUrl: 'https://lumiso.app',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Radix UI', 'Supabase', 'Deno'],
    challenge: '',
    solution: '',
    keyMetrics: []
  },
  {
    id: 'naapim',
    title: 'Naapim?',
    category: 'AI Kişisel Karar Destek Asistanı',
    outcome: '',
    imageUrl: '/Naapim.webp',
    projectUrl: 'https://naapim.com',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Supabase', 'pgvector', 'Deno', 'OpenAI'],
    challenge: '',
    solution: '',
    keyMetrics: []
  },
  {
    id: 'serviceops-platform',
    title: 'ServiceOps Platform',
    category: 'AI Destekli Randevu ve Tahsilat Platformu',
    outcome: '',
    imageUrl: '/ServiceOps.webp',
    inProgress: true,
    stack: ['React Native', 'TypeScript', 'Node.js', 'Serverless', 'AWS', 'Payment Gateway', 'E-Fatura', 'AI Scheduling'],
    challenge: '',
    solution: '',
    keyMetrics: []
  },
];