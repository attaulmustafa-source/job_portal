/** Demo analytics numbers for client UI/UX review (not live production data). */
export const demoAnalytics = {
  totalEmployers: 4008,
  totalJobs: 88677,
  totalSessions: 0,
  totalPlacements: 0,
  employers: {
    all: 4008,
    government: 53,
    private: 51,
    foreign: 299,
  },
  jobsAndSeekers: {
    jobs: 88677,
    jobSeekers: 54313,
  },
  placements: {
    centers: 0,
    officers: 0,
  },
  jpo: {
    industrialSessions: 0,
    counsellingSessions: 0,
  },
  tradeWiseJobs: [
    { label: "IT / Software", value: 18420, color: "#2f4d9a", tooltip: "18420 IT / Software jobs" },
    { label: "Electrical", value: 15210, color: "#16a34a", tooltip: "15210 Electrical jobs" },
    { label: "Mechanical", value: 12880, color: "#f59e0b", tooltip: "12880 Mechanical jobs" },
    { label: "Hospitality", value: 9650, color: "#db2777", tooltip: "9650 Hospitality jobs" },
    { label: "Construction", value: 8410, color: "#0d9488", tooltip: "8410 Construction jobs" },
    { label: "Other", value: 24107, color: "#7c3aed", tooltip: "24107 other trade jobs" },
  ],
  qualificationWise: [
    { label: "Diploma", value: 31200, color: "#2f4d9a", tooltip: "31200 Diploma jobs" },
    { label: "Certificate", value: 28450, color: "#16a34a", tooltip: "28450 Certificate jobs" },
    { label: "DAE", value: 16800, color: "#f59e0b", tooltip: "16800 DAE jobs" },
    { label: "Short Course", value: 12227, color: "#db2777", tooltip: "12227 Short Course jobs" },
  ],
  genderWise: [
    { label: "Male quota", value: 62040, color: "#2f4d9a", tooltip: "62040 male-quota jobs" },
    { label: "Female quota", value: 22110, color: "#db2777", tooltip: "22110 female-quota jobs" },
    { label: "Open / Any", value: 4527, color: "#f59e0b", tooltip: "4527 open / any jobs" },
  ],
  regionWise: [
    { label: "Punjab", value: 38200, color: "#16a34a", tooltip: "38200 jobs in Punjab" },
    { label: "Sindh", value: 21450, color: "#2f4d9a", tooltip: "21450 jobs in Sindh" },
    { label: "KPK", value: 14820, color: "#f59e0b", tooltip: "14820 jobs in KPK" },
    { label: "Balochistan", value: 6210, color: "#db2777", tooltip: "6210 jobs in Balochistan" },
    { label: "ICT / AJK / GB", value: 7997, color: "#0d9488", tooltip: "7997 jobs in ICT / AJK / GB" },
  ],
  provinceSeekers: [
    { label: "Punjab", value: 24100 },
    { label: "Sindh", value: 13250 },
    { label: "KPK", value: 9800 },
    { label: "Balochistan", value: 4120 },
    { label: "Others", value: 3043 },
  ],
  topEmployers: [
    { label: "Private / Others", value: 62, color: "#2f4d9a" },
    { label: "Foreign / Overseas", value: 24, color: "#f59e0b" },
    { label: "Government", value: 14, color: "#16a34a" },
  ],
  orgByJobs: [
    { label: "Private/Others", value: 52140 },
    { label: "Foreign/Overseas", value: 24810 },
    { label: "Government", value: 11727 },
  ],
  highestPayTrades: [
    { label: "Oil & Gas Tech", value: 1850 },
    { label: "Software Dev", value: 1420 },
    { label: "Electrical Eng.", value: 1180 },
    { label: "Welding (Abroad)", value: 980 },
    { label: "HVAC", value: 760 },
  ],
  salaryScope: {
    overall: 920,
    foreign: 1450,
    local: 480,
  },
  hiredThroughPortal: 1,
  yearTrend: {
    jobs: [4200, 5100, 6300, 7200, 8100, 9000, 9800, 10400, 11200, 12100, 12800, 13500],
    seekers: [2800, 3200, 3600, 4100, 4500, 4900, 5300, 5700, 6100, 6500, 6900, 7200],
    applications: [1500, 1800, 2100, 2500, 2900, 3300, 3700, 4100, 4500, 4900, 5300, 5600],
  },
  jobsPostedBy: [
    { label: "NSIS", value: 41200, color: "#2f4d9a", tooltip: "41200 jobs posted by NSIS" },
    { label: "Employer", value: 35800, color: "#16a34a", tooltip: "35800 jobs posted by employers" },
    { label: "API", value: 11677, color: "#f59e0b", tooltip: "11677 jobs posted via API" },
  ],
  employerStatus: [
    { label: "Approved", value: 3610, color: "#16a34a", tooltip: "3610 employers approved" },
    { label: "Pending", value: 280, color: "#f59e0b", tooltip: "280 employers pending approval" },
    { label: "Rejected", value: 118, color: "#dc2626", tooltip: "118 employers rejected" },
  ],
  jobStatus: [
    { label: "Active", value: 51240, color: "#16a34a", tooltip: "51240 jobs available" },
    { label: "Expired", value: 28410, color: "#f59e0b", tooltip: "28410 jobs expired" },
    { label: "Draft", value: 9027, color: "#2f4d9a", tooltip: "9027 draft jobs" },
  ],
  sessionStatus: [
    { label: "Completed", value: 0, color: "#16a34a", tooltip: "0 sessions completed" },
    { label: "Scheduled", value: 0, color: "#2f4d9a", tooltip: "0 sessions scheduled" },
    { label: "Pending", value: 0, color: "#f59e0b", tooltip: "0 sessions pending" },
  ],
  placementStatus: [
    { label: "Placed", value: 0, color: "#16a34a", tooltip: "0 placements completed" },
    { label: "In progress", value: 0, color: "#2f4d9a", tooltip: "0 placements in progress" },
    { label: "Not placed", value: 0, color: "#db2777", tooltip: "0 not placed" },
  ],
};

export function pct(part: number, whole: number) {
  if (!whole) return 0;
  return (part / whole) * 100;
}
