import { CandidateProfile, MatchResult, Opportunity, Requirement } from "@/types/domain";

function evaluateRequirement(profile: CandidateProfile, requirement: Requirement) {
  switch (requirement.kind) {
    case "country":
      return {
        matched: profile.country.toLowerCase() === String(requirement.value).toLowerCase(),
        evidence: `Profile country: ${profile.country}`,
      };
    case "education":
      return {
        matched: profile.education.toLowerCase().includes(String(requirement.value).toLowerCase()),
        evidence: `Current program: ${profile.education}`,
      };
    case "semester":
      return {
        matched: profile.semester >= Number(requirement.value),
        evidence: `Current semester: ${profile.semester}`,
      };
    case "skill": {
      const skill = profile.skills.find((item) => item.toLowerCase() === String(requirement.value).toLowerCase());
      return { matched: Boolean(skill), evidence: skill ? `Verified skill: ${skill}` : `Missing skill: ${requirement.value}` };
    }
    case "interest": {
      const interest = profile.interests.find((item) => item.toLowerCase() === String(requirement.value).toLowerCase());
      return { matched: Boolean(interest), evidence: interest ? `Profile interest: ${interest}` : `Interest not listed: ${requirement.value}` };
    }
  }
}

export function calculateMatch(profile: CandidateProfile, opportunity: Opportunity): MatchResult {
  const results = opportunity.requirements.map((requirement) => ({
    requirementId: requirement.id,
    label: requirement.label,
    required: requirement.required,
    ...evaluateRequirement(profile, requirement),
  }));
  const weight = (item: (typeof results)[number]) => (item.required ? 2 : 1);
  const possible = results.reduce((sum, item) => sum + weight(item), 0);
  const achieved = results.filter((item) => item.matched).reduce((sum, item) => sum + weight(item), 0);
  return {
    opportunityId: opportunity.id,
    score: Math.round((achieved / possible) * 100),
    eligible: results.filter((item) => item.required).every((item) => item.matched),
    results,
  };
}
