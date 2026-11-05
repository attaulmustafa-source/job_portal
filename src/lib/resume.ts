import type {
  ResumeCertificationItem,
  ResumeContent,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeLanguageItem,
  ResumeProjectItem,
  ResumeReferenceItem,
  ResumeSkillItem,
  SeekerProfile,
} from "./types";

export const CITIES = [
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Karachi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Other",
];

export const EDUCATION_LEVELS = [
  "Matric",
  "Intermediate",
  "Diploma / DAE",
  "Bachelor",
  "Master",
  "MPhil / PhD",
  "Certificate",
  "Other",
];

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyEducation(): ResumeEducationItem {
  return {
    id: newId("edu"),
    degree: "",
    institution: "",
    boardUniversity: "",
    fieldOfStudy: "",
    obtainedMarks: "",
    totalMarks: "",
    startDate: "",
    completionDate: "",
    educationLevel: "",
  };
}

export function emptyExperience(): ResumeExperienceItem {
  return {
    id: newId("exp"),
    jobTitle: "",
    company: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
  };
}

export function emptySkill(): ResumeSkillItem {
  return { id: newId("skill"), skillName: "", skillLevel: "" };
}

export function emptyCertification(): ResumeCertificationItem {
  return {
    id: newId("cert"),
    courseName: "",
    instituteName: "",
    issueDate: "",
    expiryDate: "",
    certificateId: "",
  };
}

export function emptyLanguage(): ResumeLanguageItem {
  return { id: newId("lang"), languageName: "", proficiency: "" };
}

export function emptyProject(): ResumeProjectItem {
  return {
    id: newId("proj"),
    projectName: "",
    description: "",
    role: "",
    completionDate: "",
    achievements: "",
  };
}

export function emptyReference(): ResumeReferenceItem {
  return {
    id: newId("ref"),
    name: "",
    designation: "",
    organization: "",
    contactNumber: "",
    email: "",
  };
}

export function emptyResumeContent(): ResumeContent {
  return {
    fullName: "",
    profilePicture: "",
    fatherName: "",
    cnic: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    cityDistrict: "",
    careerObjective: "",
    educationItems: [emptyEducation()],
    experienceItems: [emptyExperience()],
    skillItems: [emptySkill()],
    technicalSkills: "",
    softSkills: "",
    certifications: [emptyCertification()],
    languages: [emptyLanguage()],
    projects: [emptyProject()],
    references: [],
  };
}

export function emptySeekerProfile(): SeekerProfile {
  return {
    fullName: "",
    profilePicture: "",
    cnicFrontPic: "",
    cnicBackPic: "",
    fatherName: "",
    cnic: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    careerObjective: "",
    educationItems: [emptyEducation()],
    experienceItems: [emptyExperience()],
    skillItems: [emptySkill()],
    technicalSkills: "",
    softSkills: "",
    certifications: [emptyCertification()],
    languages: [emptyLanguage()],
    projects: [emptyProject()],
    references: [],
  };
}

/** Normalize legacy flat seeker profiles into the full structured schema */
export function normalizeSeekerProfile(rawInput?: unknown): SeekerProfile {
  const raw = (rawInput || {}) as Record<string, unknown>;
  const base = emptySeekerProfile();
  const educationItems = Array.isArray(raw.educationItems)
    ? (raw.educationItems as ResumeEducationItem[])
    : raw.education
      ? [{ ...emptyEducation(), degree: String(raw.education) }]
      : base.educationItems;
  const experienceItems = Array.isArray(raw.experienceItems)
    ? (raw.experienceItems as ResumeExperienceItem[])
    : base.experienceItems;
  const skillItems = Array.isArray(raw.skillItems)
    ? (raw.skillItems as ResumeSkillItem[])
    : raw.skills
      ? String(raw.skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((skillName) => ({ ...emptySkill(), skillName }))
      : base.skillItems;

  return {
    ...base,
    fullName: String(raw.fullName || ""),
    profilePicture: String(raw.profilePicture || ""),
    cnicFrontPic: String(raw.cnicFrontPic || ""),
    cnicBackPic: String(raw.cnicBackPic || ""),
    fatherName: String(raw.fatherName || ""),
    cnic: String(raw.cnic || ""),
    phone: String(raw.phone || raw.mobile || ""),
    dateOfBirth: String(raw.dateOfBirth || ""),
    gender: String(raw.gender || ""),
    address: String(raw.address || ""),
    city: String(raw.city || raw.cityDistrict || ""),
    careerObjective: String(raw.careerObjective || ""),
    educationItems: educationItems.length ? educationItems : [emptyEducation()],
    experienceItems: experienceItems.length ? experienceItems : [emptyExperience()],
    skillItems: skillItems.length ? skillItems : [emptySkill()],
    technicalSkills: String(raw.technicalSkills || raw.skills || ""),
    softSkills: String(raw.softSkills || ""),
    certifications: Array.isArray(raw.certifications)
      ? (raw.certifications as ResumeCertificationItem[])
      : [emptyCertification()],
    languages: Array.isArray(raw.languages)
      ? (raw.languages as ResumeLanguageItem[])
      : [emptyLanguage()],
    projects: Array.isArray(raw.projects)
      ? (raw.projects as ResumeProjectItem[])
      : [emptyProject()],
    references: Array.isArray(raw.references)
      ? (raw.references as ResumeReferenceItem[])
      : [],
  };
}

export function contentFromProfile(
  email: string,
  profile?: SeekerProfile
): ResumeContent {
  const p = normalizeSeekerProfile(profile);
  return {
    fullName: p.fullName,
    profilePicture: p.profilePicture,
    fatherName: p.fatherName,
    cnic: p.cnic,
    email: email || "",
    mobile: p.phone,
    dateOfBirth: p.dateOfBirth,
    gender: p.gender,
    address: p.address,
    cityDistrict: p.city,
    careerObjective: p.careerObjective,
    educationItems: p.educationItems,
    experienceItems: p.experienceItems,
    skillItems: p.skillItems,
    technicalSkills: p.technicalSkills,
    softSkills: p.softSkills,
    certifications: p.certifications,
    languages: p.languages,
    projects: p.projects,
    references: p.references,
  };
}

/** Write resume content back into seeker profile (keeps CNIC image fields) */
export function profileFromResumeContent(
  content: ResumeContent,
  existing?: SeekerProfile
): SeekerProfile {
  const prev = normalizeSeekerProfile(existing);
  const normalized = normalizeResumeContent(content);
  return {
    ...prev,
    fullName: normalized.fullName,
    profilePicture: normalized.profilePicture || prev.profilePicture,
    fatherName: normalized.fatherName,
    cnic: normalized.cnic || prev.cnic,
    phone: normalized.mobile || prev.phone,
    dateOfBirth: normalized.dateOfBirth,
    gender: normalized.gender,
    address: normalized.address,
    city: normalized.cityDistrict || prev.city,
    careerObjective: normalized.careerObjective,
    educationItems: normalized.educationItems,
    experienceItems: normalized.experienceItems,
    skillItems: normalized.skillItems,
    technicalSkills: normalized.technicalSkills,
    softSkills: normalized.softSkills,
    certifications: normalized.certifications,
    languages: normalized.languages,
    projects: normalized.projects,
    references: normalized.references,
  };
}

/** Normalize legacy flat resume content into structured schema */
export function normalizeResumeContent(rawInput: unknown): ResumeContent {
  const raw = (rawInput || {}) as Record<string, unknown>;
  const base = emptyResumeContent();
  const educationItems = Array.isArray(raw.educationItems)
    ? (raw.educationItems as ResumeEducationItem[])
    : raw.education
      ? [{ ...emptyEducation(), degree: String(raw.education) }]
      : base.educationItems;
  const experienceItems = Array.isArray(raw.experienceItems)
    ? (raw.experienceItems as ResumeExperienceItem[])
    : raw.experience
      ? [{ ...emptyExperience(), responsibilities: String(raw.experience) }]
      : base.experienceItems;
  const skillItems = Array.isArray(raw.skillItems)
    ? (raw.skillItems as ResumeSkillItem[])
    : raw.skills
      ? String(raw.skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((skillName) => ({ ...emptySkill(), skillName }))
      : base.skillItems;

  return {
    ...base,
    fullName: String(raw.fullName || ""),
    profilePicture: String(raw.profilePicture || ""),
    fatherName: String(raw.fatherName || ""),
    cnic: String(raw.cnic || ""),
    email: String(raw.email || ""),
    mobile: String(raw.mobile || raw.phone || ""),
    dateOfBirth: String(raw.dateOfBirth || ""),
    gender: String(raw.gender || ""),
    address: String(raw.address || ""),
    cityDistrict: String(raw.cityDistrict || raw.city || ""),
    careerObjective: String(raw.careerObjective || raw.summary || ""),
    educationItems: educationItems.length ? educationItems : [emptyEducation()],
    experienceItems: experienceItems.length ? experienceItems : [emptyExperience()],
    skillItems: skillItems.length ? skillItems : [emptySkill()],
    technicalSkills: String(raw.technicalSkills || ""),
    softSkills: String(raw.softSkills || ""),
    certifications: Array.isArray(raw.certifications)
      ? (raw.certifications as ResumeCertificationItem[])
      : [emptyCertification()],
    languages: Array.isArray(raw.languages)
      ? (raw.languages as ResumeLanguageItem[])
      : [emptyLanguage()],
    projects: Array.isArray(raw.projects)
      ? (raw.projects as ResumeProjectItem[])
      : [emptyProject()],
    references: Array.isArray(raw.references)
      ? (raw.references as ResumeReferenceItem[])
      : [],
  };
}
