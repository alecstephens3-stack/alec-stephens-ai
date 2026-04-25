export interface CaseStudyImage {
  src: string;
  alt: string;
}

export interface CaseStudy {
  title: string;
  description: string;
  tags: string[];
  metric: string;
  metricLabel: string;
  images?: CaseStudyImage[];
  demoVideo?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Solution {
  title: string;
  problem: string;
  roiHook: string;
  industries: string[];
  icon: string;
}

export interface OptometryStat {
  value: string;
  caption: string;
  highlight?: string;
  accent?: boolean;
}

export interface OptometryModule {
  number: string;
  title: string;
  problem: string;
  solution: string;
  howItWorks: string[];
  roi: {
    lead: string;
    highlight: string;
    trail: string;
  };
}