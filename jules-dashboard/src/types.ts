export type View = 'dashboard' | 'antigravity' | 'domains' | 'scripts' | 'command' | 'governance' | 'audit' | 'security' | 'impact' | 'transparency' | 'gospel' | 'dating' | 'store' | 'dao' | 'kickstarter' | 'edu' | 'pr' | 'review' | 'media' | 'kids' | 'browser' | 'chat' | 'live' | 'mobile' | 'droid' | 'subscribe' | 'ops' | 'skeleton-demo';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  domain?: string;
}

export interface DomainConfig {
  id: string;
  url: string;
  status: 'Active' | 'Pending' | 'Inactive';
  ssl: boolean;
  ageGate: boolean;
  dataPipe: string;
}

export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  category: 'deployment' | 'maintenance' | 'automation';
}

export interface LedgerEntry {
  id: string;
  source: string;
  grossAmount: number;
  charity: number;
  infra: number;
  owner: number;
  timestamp: string;
  status: 'CLEARED' | 'PENDING';
  hash: string;
}

export interface AgentNode {
  id: string;
  name: string;
  type: 'T5500' | 'Local' | 'Cloud';
  status: 'Online' | 'Busy' | 'Offline';
  load: number;
  currentTask?: string;
}

export interface AntigravityApplicant {
  id: string;
  name: string;
  specialty: string;
  score: number;
  pitch: string;
  github: string;
  status: 'Active' | 'Pending' | 'Rejected';
}

export type SystemHealth = 'Healthy' | 'Warning' | 'Critical';
