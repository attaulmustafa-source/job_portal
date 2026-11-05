export type SuccessStory = {
  id: string;
  name: string;
  role: string;
  location: string;
  summary: string;
  body: string;
  photo: string;
};

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "sara-ahmed",
    name: "Sara Ahmed",
    role: "Software Developer",
    location: "Lahore",
    summary:
      "After completing NAVTTC training, Sara secured a full-time role through the Job Portal within weeks.",
    body: "Sara completed a NAVTTC software development program and built her profile on the national Job Portal. With counsellor support and targeted applications, she joined a technology employer in Lahore and continues to grow her career in web and application development.",
    photo: "/landing/success-person-1.jpg",
  },
  {
    id: "ali-raza",
    name: "Ali Raza",
    role: "Electrical Technician",
    location: "Karachi",
    summary:
      "Ali used counselling and job matching on the portal to land a skilled trade position with a leading employer.",
    body: "Ali focused on electrical safety and industrial wiring skills through NAVTTC pathways. Using career counselling and job alerts on the portal, he connected with employers seeking certified technicians and secured a stable trade role in Karachi.",
    photo: "/landing/success-person-2.jpg",
  },
  {
    id: "fatima-khan",
    name: "Fatima Khan",
    role: "Healthcare Support Officer",
    location: "Islamabad",
    summary:
      "Fatima found a healthcare support role after building her resume and applying through verified openings.",
    body: "With a NAVTTC-aligned healthcare support pathway behind her, Fatima created a complete resume on the portal and applied to government and private openings. She was selected for a support role in Islamabad and credits structured applications for her success.",
    photo: "/landing/success-person-3.jpg",
  },
  {
    id: "bilal-hussain",
    name: "Bilal Hussain",
    role: "Construction Supervisor",
    location: "Faisalabad",
    summary:
      "Bilal progressed from training to a supervisory post through overseas and domestic job listings.",
    body: "Bilal used the portal to explore both domestic and overseas construction opportunities. After shortlisting roles that matched his experience, he accepted a supervisor position with a major contractor and continues to mentor junior technicians.",
    photo: "/landing/success-person-4.jpg",
  },
  {
    id: "aisha-malik",
    name: "Aisha Malik",
    role: "Hospitality Associate",
    location: "Rawalpindi",
    summary:
      "Aisha moved into hospitality after discovering private-sector openings tailored to her skills.",
    body: "Aisha registered as a seeker, completed her profile, and filtered hospitality roles across Punjab. Within a short period she joined a service employer in Rawalpindi and is building customer-service experience for future growth.",
    photo: "/landing/success-person-5.jpg",
  },
  {
    id: "hamza-iqbal",
    name: "Hamza Iqbal",
    role: "Business Analyst",
    location: "Islamabad",
    summary:
      "Hamza leveraged NAVTTC credentials and portal applications to enter a business and finance team.",
    body: "Hamza combined his NAVTTC credentials with a strong portal profile and applied to business and finance openings. Employers reviewed his applications through the platform, and he joined an Islamabad-based team as a business analyst.",
    photo: "/landing/success-person-6.jpg",
  },
];

export function getFeaturedSuccessStories(limit = 2) {
  return SUCCESS_STORIES.slice(0, limit);
}

export function getSuccessStory(id: string) {
  return SUCCESS_STORIES.find((s) => s.id === id);
}
