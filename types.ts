import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  outcome: string;
  imageUrl: string;
  projectUrl?: string;
  inProgress?: boolean;
  stack: string[];
  challenge: string;
  solution: string;
  keyMetrics: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface AIAnalysisResult {
  feasibilityScore: number;
  viabilityVerdict: string;
  complexity: {
    frontend: number;
    backend: number;
    ai: number;
  };
  technicalChallenges: string[];
  recommendedStack: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  mvpTimeline: string;
  marketAnalysis: string;
  monetizationStrategy: string;
  agensInsight: string;
  implementationSteps: string[];
}