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
    id: 'fintech-app',
    title: 'Nova Finance',
    category: 'Fintech Mobile App',
    outcome: 'Processed $2M+ in transactions within first 3 months.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
    stack: ['React Native', 'Node.js', 'AWS Lambda'],
    challenge: 'Nova needed to launch a secure, millisecond-latency trading platform on both iOS and Android within 12 weeks. The existing legacy API was slow and prone to timeouts during high traffic.',
    solution: 'We rebuilt the mobile architecture using React Native for cross-platform efficiency and implemented an Event-Driven serverless backend on AWS. We integrated biometric security and WebSocket feeds for real-time market data.',
    keyMetrics: ['40% reduction in API latency', '99.99% server uptime', '4.8/5 App Store rating']
  },
  {
    id: 'saas-dashboard',
    title: 'Orbital Analytics',
    category: 'SaaS Platform',
    outcome: 'Reduced data reporting time by 85% for enterprise clients.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    stack: ['React', 'TypeScript', 'Python', 'WebGL'],
    challenge: 'Enterprise clients were struggling to visualize terabytes of satellite imagery data. Their previous dashboard took 20+ seconds to load effectively rendering it unusable for real-time decision making.',
    solution: 'We engineered a high-performance frontend using WebGL for GPU-accelerated rendering. The backend was optimized with Python and Redis caching layers to pre-process complex aggregations.',
    keyMetrics: ['Sub-200ms load times', 'Processed 1TB+ daily data', 'Adoption increased by 300%']
  },
  {
    id: 'health-portal',
    title: 'Vital Sync',
    category: 'Healthcare Web App',
    outcome: 'Securely serving 50k+ patients with real-time updates.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    stack: ['Next.js', 'PostgreSQL', 'Docker', 'HIPAA'],
    challenge: 'Connecting 50+ fragmented clinic databases into a single patient portal while maintaining strict HIPAA compliance and data sovereignty was the primary bottleneck.',
    solution: 'We designed a federated GraphQL API to unify data sources without migrating legacy databases. The frontend was built with Next.js for SEO and speed, wrapped in an end-to-end encrypted security layer.',
    keyMetrics: ['Zero data breaches', '50k+ active patients', '15 mins saved per appointment']
  },
];