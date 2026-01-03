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
  mvpModules: string[];
  phase2Modules: string[];
  recommendedStack: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  integrations: {
    category: string;
    required: boolean;
    options: string[];
    notes?: string;
  }[];
  compliance: string[];
  mvpTimeline: string;
  marketAnalysis: string;
  monetizationStrategy: string;
  validationPlan: string[];
  openQuestions: string[];
  agensInsight: string;
  implementationSteps?: string[];
}
