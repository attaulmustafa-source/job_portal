export type CareerAdvisor = {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  summary: string;
  body: string;
  photo: string;
};

export const CAREER_ADVISORS: CareerAdvisor[] = [
  {
    id: "amina-siddiqui",
    name: "Amina Siddiqui",
    title: "Senior Career Counsellor",
    specialty: "IT & Digital Careers",
    location: "Islamabad",
    summary:
      "Guides NAVTTC graduates into software, data, and digital roles with resume and interview coaching.",
    body: "Amina has supported hundreds of seekers transitioning into technology careers. She helps candidates map NAVTTC skills to portal openings, strengthen digital portfolios, and prepare for technical interviews with private and government employers.",
    photo: "/landing/advisor-1.jpg",
  },
  {
    id: "omar-farooq",
    name: "Omar Farooq",
    title: "Career Advisor",
    specialty: "Skilled Trades & Industry",
    location: "Lahore",
    summary:
      "Specialises in electrical, construction, and industrial pathways for certified technicians.",
    body: "Omar works closely with industrial employers and training centres. He advises trades graduates on safety certifications, shortlisting suitable jobs on the portal, and presenting practical experience during hiring days and interviews.",
    photo: "/landing/advisor-2.jpg",
  },
  {
    id: "nadia-rehman",
    name: "Nadia Rehman",
    title: "Lead Career Coach",
    specialty: "Healthcare & Services",
    location: "Karachi",
    summary:
      "Supports healthcare and service-sector seekers with profile building and employer matching.",
    body: "Nadia focuses on healthcare support, hospitality, and customer-service careers. She helps seekers complete strong portal profiles, choose relevant openings, and practice competency-based interviews with confidence.",
    photo: "/landing/advisor-3.jpg",
  },
  {
    id: "hassan-malik",
    name: "Hassan Malik",
    title: "Overseas Placement Advisor",
    specialty: "International Employment",
    location: "Rawalpindi",
    summary:
      "Advises candidates on verified overseas listings, documentation, and interview readiness.",
    body: "Hassan guides seekers exploring Gulf and international opportunities listed on the portal. He covers document checklists, employer verification signals, and how to prepare for remote and on-site interviews with foreign employers.",
    photo: "/landing/advisor-4.jpg",
  },
  {
    id: "sana-qureshi",
    name: "Sana Qureshi",
    title: "Career Development Officer",
    specialty: "Women in Skills",
    location: "Faisalabad",
    summary:
      "Mentors women graduates on workplace readiness, interviews, and career progression.",
    body: "Sana runs workshops and one-to-one sessions for women in NAVTTC programmes. She helps participants build professional profiles, apply strategically, and navigate early career challenges with practical, supportive coaching.",
    photo: "/landing/advisor-5.jpg",
  },
  {
    id: "imran-zafar",
    name: "Imran Zafar",
    title: "Employability Advisor",
    specialty: "Business & Administration",
    location: "Islamabad",
    summary:
      "Helps business, finance, and admin seekers align credentials with employer demand.",
    body: "Imran partners with employers seeking administrative and business talent. He coaches seekers on CV structure, competency stories, and selecting openings that match their NAVTTC credentials and experience level.",
    photo: "/landing/advisor-6.jpg",
  },
];

export function getFeaturedCareerAdvisors(limit = 2) {
  return CAREER_ADVISORS.slice(0, limit);
}

export function getCareerAdvisor(id: string) {
  return CAREER_ADVISORS.find((a) => a.id === id);
}
