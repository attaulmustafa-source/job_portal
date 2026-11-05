export const SEEKER_PROFILE_SECTIONS = [
  {
    id: "profile",
    label: "Your profile",
    title: "Your profile",
    subtitle: "Personal information and identity documents.",
    emptyMessage: "No profile details yet. Open this section to get started.",
    must: true,
  },
  {
    id: "qualification",
    label: "Your qualifications",
    title: "Your qualifications",
    subtitle: "Academic and technical credentials.",
    emptyMessage: "No qualifications added yet.",
    must: true,
  },
  {
    id: "experience",
    label: "Your experience",
    title: "Your experience",
    subtitle: "Optional unless a job requires experience.",
    emptyMessage: "No experience added yet.",
    must: false,
  },
  {
    id: "skills",
    label: "Your skills",
    title: "Your skills",
    subtitle: "Technical and soft skills.",
    emptyMessage: "No skills added yet.",
    must: false,
  },
  {
    id: "certifications",
    label: "Your certifications",
    title: "Your certifications",
    subtitle: "Courses, certificates, and training.",
    emptyMessage: "No certifications added yet.",
    must: false,
  },
  {
    id: "languages",
    label: "Your languages",
    title: "Your languages",
    subtitle: "Languages and proficiency.",
    emptyMessage: "No languages added yet.",
    must: false,
  },
  {
    id: "projects",
    label: "Your projects",
    title: "Your projects",
    subtitle: "Projects and achievements.",
    emptyMessage: "No projects added yet.",
    must: false,
  },
  {
    id: "references",
    label: "Your references",
    title: "Your references",
    subtitle: "Optional professional references.",
    emptyMessage: "No references added yet.",
    must: false,
  },
] as const;

export type SeekerProfileSectionId = (typeof SEEKER_PROFILE_SECTIONS)[number]["id"];

export function getSeekerProfileSection(id: SeekerProfileSectionId) {
  return SEEKER_PROFILE_SECTIONS.find((s) => s.id === id)!;
}

export function nextSeekerProfileSection(
  id: SeekerProfileSectionId
): SeekerProfileSectionId | null {
  const index = SEEKER_PROFILE_SECTIONS.findIndex((s) => s.id === id);
  if (index < 0 || index >= SEEKER_PROFILE_SECTIONS.length - 1) return null;
  return SEEKER_PROFILE_SECTIONS[index + 1].id;
}
