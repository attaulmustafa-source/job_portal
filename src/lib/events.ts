export type PortalEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  summary: string;
  body: string;
  image: string;
};

export const PORTAL_EVENTS: PortalEvent[] = [
  {
    id: "job-fair-islamabad",
    title: "National Job Fair — Islamabad",
    date: "15 Nov 2026",
    time: "10:00 AM – 4:00 PM",
    location: "Pak-China Friendship Centre, Islamabad",
    category: "Job Fair",
    summary:
      "Meet government, private, and overseas employers hiring NAVTTC-certified talent.",
    body: "Join Pakistan’s national job fair hosted with NAVTTC partners. Candidates can meet employers face-to-face, submit resumes on the spot, and learn about domestic and overseas openings. Bring your CNIC and updated CV; pre-registration on the Job Portal is recommended.",
    image: "/landing/event-1.jpg",
  },
  {
    id: "career-counselling-lahore",
    title: "Career Counselling Drive — Lahore",
    date: "22 Nov 2026",
    time: "9:30 AM – 2:00 PM",
    location: "NAVTTC Regional Office, Lahore",
    category: "Counselling",
    summary:
      "One-to-one guidance sessions on resume building, interview prep, and career pathways.",
    body: "Career advisors will help job seekers map skills to openings, refine resumes on the portal, and prepare for interviews. Sessions are free for registered seekers. Book a slot early — walk-ins are subject to availability.",
    image: "/landing/event-2.jpg",
  },
  {
    id: "employer-engagement-karachi",
    title: "Employer Engagement Summit — Karachi",
    date: "5 Dec 2026",
    time: "11:00 AM – 3:00 PM",
    location: "Expo Centre, Karachi",
    category: "Employers",
    summary:
      "Private and industrial employers explore hiring pipelines through the NAVTTC Job Portal.",
    body: "Employers learn how to register, post jobs, and shortlist certified candidates. Industry panels cover skills demand in manufacturing, IT, and hospitality. Networking lunch included for confirmed employer registrations.",
    image: "/landing/event-3.jpg",
  },
  {
    id: "skills-showcase-faisalabad",
    title: "Skills Showcase & Hiring Day",
    date: "12 Dec 2026",
    time: "10:00 AM – 5:00 PM",
    location: "Faisalabad Chamber of Commerce",
    category: "Hiring Day",
    summary:
      "Live skill demos and on-the-spot interviews for technical and trade graduates.",
    body: "Trainees demonstrate practical skills while employers conduct rapid interviews. Focus trades include electrical, textiles, and machine operations. Candidates should register on the portal and select this event under Upcoming Events.",
    image: "/landing/event-4.jpg",
  },
  {
    id: "overseas-orientation-rawalpindi",
    title: "Overseas Employment Orientation",
    date: "18 Dec 2026",
    time: "2:00 PM – 5:00 PM",
    location: "Rawalpindi Convention Hall",
    category: "Overseas",
    summary:
      "Guidance on overseas job listings, documentation, and verified foreign employers.",
    body: "Learn how overseas openings appear on the portal, what documents employers require, and how to avoid fraudulent offers. Advisors and partner facilitators will answer questions on Gulf and international placements.",
    image: "/landing/event-5.jpg",
  },
  {
    id: "women-in-skills-workshop",
    title: "Women in Skills Workshop",
    date: "8 Jan 2027",
    time: "10:00 AM – 1:00 PM",
    location: "NAVTTC Centre of Excellence",
    category: "Workshop",
    summary:
      "Workshop for women graduates on digital profiles, interviews, and workplace readiness.",
    body: "Interactive sessions cover building a strong seeker profile, applying confidently, and navigating interviews. Mentors share success stories from the portal. Open to women enrolled in or graduated from NAVTTC programmes.",
    image: "/landing/event-6.jpg",
  },
];

export function getFeaturedEvents(limit = 2) {
  return PORTAL_EVENTS.slice(0, limit);
}

export function getPortalEvent(id: string) {
  return PORTAL_EVENTS.find((e) => e.id === id);
}
