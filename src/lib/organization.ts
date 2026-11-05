import type { OrganizationDetails } from "./types";

export const ORGANIZATION_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

export const ADMINISTRATION_LEVELS = [
  "Federal",
  "Provincial",
  "District",
  "Local",
  "Private / Corporate",
  "Other",
];

export const ORG_COUNTRIES = ["Pakistan", "UAE", "Saudi Arabia", "Other"];

export const ORG_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Other",
];

export const EMPLOYER_ORG_SECTIONS = [
  {
    id: "basic",
    title: "Basic Information",
    subtitle: "Organization identity, registration, and type.",
    emptyMessage: "No basic information yet. Open this section to get started.",
    must: true,
  },
  {
    id: "administrative",
    title: "Administrative Status",
    subtitle: "Ministry, division, and province.",
    emptyMessage: "No administrative status added yet.",
    must: true,
  },
  {
    id: "address",
    title: "Employer Address",
    subtitle: "Location and about the organization.",
    emptyMessage: "No address added yet.",
    must: true,
  },
  {
    id: "leadership",
    title: "Leadership & Focal Person",
    subtitle: "CEO and focal person contacts.",
    emptyMessage: "No leadership contacts added yet.",
    must: true,
  },
  {
    id: "about",
    title: "Website & Vision",
    subtitle: "Website, fax, vision, and organization logo.",
    emptyMessage: "No website or vision details yet.",
    must: true,
  },
] as const;

export type EmployerOrgSectionId = (typeof EMPLOYER_ORG_SECTIONS)[number]["id"];

export function emptyOrganization(): OrganizationDetails {
  return {
    organizationName: "",
    category: "",
    organizationSize: "",
    registrationAuthority: "",
    registrationNumber: "",
    ntn: "",
    administrationLevel: "",
    industry: "",
    ministry: "",
    division: "",
    adminProvince: "",
    focalPersonName: "",
    focalPersonPhone: "",
    focalPersonDesignation: "",
    country: "",
    provinceState: "",
    district: "",
    tehsil: "",
    address: "",
    about: "",
    website: "",
    faxNumber: "",
    vision: "",
    ceoName: "",
    ceoNumber: "",
    logoUrl: "",
  };
}

export function normalizeOrganization(rawInput?: unknown): OrganizationDetails {
  const raw = (rawInput || {}) as Record<string, unknown>;
  const base = emptyOrganization();
  return {
    ...base,
    organizationName: String(raw.organizationName || ""),
    category:
      raw.category === "Government" || raw.category === "Private" || raw.category === "Foreign"
        ? raw.category
        : "",
    organizationSize: String(raw.organizationSize || ""),
    registrationAuthority: String(raw.registrationAuthority || ""),
    registrationNumber: String(raw.registrationNumber || ""),
    ntn: String(raw.ntn || ""),
    administrationLevel: String(raw.administrationLevel || ""),
    industry: String(raw.industry || ""),
    ministry: String(raw.ministry || ""),
    division: String(raw.division || ""),
    adminProvince: String(raw.adminProvince || ""),
    focalPersonName: String(raw.focalPersonName || ""),
    focalPersonPhone: String(raw.focalPersonPhone || ""),
    focalPersonDesignation: String(raw.focalPersonDesignation || ""),
    country: String(raw.country || ""),
    provinceState: String(raw.provinceState || ""),
    district: String(raw.district || ""),
    tehsil: String(raw.tehsil || ""),
    address: String(raw.address || ""),
    about: String(raw.about || ""),
    website: String(raw.website || ""),
    faxNumber: String(raw.faxNumber || ""),
    vision: String(raw.vision || ""),
    ceoName: String(raw.ceoName || ""),
    ceoNumber: String(raw.ceoNumber || ""),
    logoUrl: String(raw.logoUrl || ""),
  };
}

function filled(value?: string) {
  return Boolean((value || "").trim());
}

export function isEmployerOrgSectionComplete(
  section: EmployerOrgSectionId,
  org?: OrganizationDetails
) {
  if (!org) return false;
  const o = normalizeOrganization(org);
  switch (section) {
    case "basic":
      return (
        filled(o.organizationName) &&
        Boolean(o.category) &&
        filled(o.organizationSize) &&
        filled(o.industry) &&
        filled(o.registrationAuthority) &&
        filled(o.registrationNumber) &&
        filled(o.ntn) &&
        filled(o.administrationLevel)
      );
    case "administrative":
      return filled(o.ministry) && filled(o.division) && filled(o.adminProvince);
    case "address":
      return (
        filled(o.country) &&
        filled(o.provinceState) &&
        filled(o.district) &&
        filled(o.tehsil) &&
        filled(o.address) &&
        filled(o.about)
      );
    case "leadership":
      return (
        filled(o.ceoName) &&
        filled(o.ceoNumber) &&
        filled(o.focalPersonName) &&
        filled(o.focalPersonPhone) &&
        filled(o.focalPersonDesignation)
      );
    case "about":
      return filled(o.website) && filled(o.faxNumber) && filled(o.vision) && filled(o.logoUrl);
    default:
      return false;
  }
}

export function isFullOrganizationComplete(org?: OrganizationDetails) {
  if (!org) return false;
  return EMPLOYER_ORG_SECTIONS.every((section) =>
    isEmployerOrgSectionComplete(section.id, org)
  );
}

export function nextEmployerOrgSection(
  id: EmployerOrgSectionId
): EmployerOrgSectionId | null {
  const index = EMPLOYER_ORG_SECTIONS.findIndex((s) => s.id === id);
  if (index < 0 || index >= EMPLOYER_ORG_SECTIONS.length - 1) return null;
  return EMPLOYER_ORG_SECTIONS[index + 1].id;
}

export function missingOrganizationFields(org?: OrganizationDetails): string[] {
  const o = normalizeOrganization(org);
  const missing: string[] = [];
  const check = (label: string, value?: string) => {
    if (!filled(value)) missing.push(label);
  };
  check("Organization Name", o.organizationName);
  if (!o.category) missing.push("Organization Type");
  check("Organization Size", o.organizationSize);
  check("Industry", o.industry);
  check("Registration Authority", o.registrationAuthority);
  check("Registration Number", o.registrationNumber);
  check("NTN", o.ntn);
  check("Administration Level", o.administrationLevel);
  check("Ministry", o.ministry);
  check("Division", o.division);
  check("Admin Province", o.adminProvince);
  check("Country", o.country);
  check("Province/State", o.provinceState);
  check("District", o.district);
  check("Tehsil", o.tehsil);
  check("Address", o.address);
  check("About", o.about);
  check("CEO Name", o.ceoName);
  check("CEO Number", o.ceoNumber);
  check("Focal Person Name", o.focalPersonName);
  check("Focal Person Number", o.focalPersonPhone);
  check("Focal Person Designation", o.focalPersonDesignation);
  check("Website", o.website);
  check("Fax Number", o.faxNumber);
  check("Vision", o.vision);
  check("Logo URL", o.logoUrl);
  return missing;
}
