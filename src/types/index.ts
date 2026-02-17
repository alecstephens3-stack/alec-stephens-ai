export interface Service {
  title: string;
  description: string;
  capabilities: string[];
  icon: string;
}

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

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}
