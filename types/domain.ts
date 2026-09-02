export type OpportunityType = "Scholarship" | "Fellowship" | "Internship" | "Hackathon";

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  country: string;
  education: string;
  semester: number;
  skills: string[];
  interests: string[];
  languages: string[];
}

export interface Requirement {
  id: string;
  label: string;
  kind: "country" | "education" | "semester" | "skill" | "interest";
  value: string | number;
  required: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  location: string;
  remote: boolean;
  deadline: string;
  summary: string;
  accent: string;
  requirements: Requirement[];
}

export interface RequirementResult {
  requirementId: string;
  label: string;
  matched: boolean;
  required: boolean;
  evidence: string;
}

export interface MatchResult {
  opportunityId: string;
  score: number;
  eligible: boolean;
  results: RequirementResult[];
}

export type ApplicationStatus = "draft" | "ready" | "submitted";

export interface ApplicationDraft {
  id: string;
  opportunityId: string;
  candidateId: string;
  status: ApplicationStatus;
  motivation: string;
  evidence: string[];
  createdAt: string;
  submittedAt?: string;
}
