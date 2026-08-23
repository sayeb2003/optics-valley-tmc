/**
 * CLUB.TS — single source of truth for all Optics Valley Toastmasters facts.
 *
 * Every component should pull club info from here, never hardcode it inline.
 * Fields wrapped like "[PLACEHOLDER]" are intentional — replace with real
 * content when available, don't delete the field.
 */

export const club = {
  name: "Optics Valley Toastmasters Club",
  shortName: "Optics Valley TMC",
  tagline: "Speak Out, Show Your Voice",
  clubNumber: "02793285",
  district: "128",
  area: "W01",
  charterDate: "2013-04-01",

  mission:
    "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.",

  meeting: {
    day: "Friday",
    time: "7:00 PM – 9:30 PM",
    frequency: "Every Friday",
    locationName: "联峰时代大厦16楼1612室",
    locationEn: "16F, Room 1612, Lianfeng Times Building",
    locationDirections:
      "Near Guanggu Square Station (光谷广场站), Exit Q — about 600m walk",
  },

  contact: {
    email: "sayeb0@outlook.com",
    wechatGroup: "Optical_Valley_TMC",
  },

  guestPricing: {
    earlyBird: "¥25 (before 1PM the day of the meeting)",
    walkIn: "¥35 (after 1PM or at the door)",
  },

  social: {
    // [PLACEHOLDER] — add real links when available
    instagram: null as string | null,
    xiaohongshu: null as string | null,
  },
} as const;

export type ExecRole = {
  name: string;
  role: string;
  bio?: string; // "[BIO_PLACEHOLDER]" when not yet provided
};

export const executiveTeam: ExecRole[] = [
  { name: "Judy", role: "President" },
  { name: "Forrest", role: "Assistant to the President" },
  { name: "Tracy", role: "Sergeant at Arms (SAA)" },
  { name: "Gondal", role: "Secretary" },
  { name: "Kasun", role: "VP Membership (VPM)" },
  { name: "Paul", role: "VP Public Relations (VPPR)" },
  { name: "Albin", role: "Assistant VPPR" },
  { name: "Lexie", role: "Assistant VPPR" },
  { name: "Francis", role: "Assistant VPPR" },
  { name: "Sayeb", role: "VP Education (VPE)" },
  { name: "Daniel", role: "Treasurer" },
  { name: "Margaret", role: "Club Finance Advisor" },
  { name: "Waqas", role: "Club Mentor" },
];

export type PastLeader = {
  name: string;
  role: string;
  note?: string;
};

export const pastLeaders: PastLeader[] = [
  { name: "Teddy", role: "Former President", note: "Also served as VPE (Jun–Jul 2026 and other full terms)" },
  { name: "Paul", role: "Former President" },
  { name: "Waqas", role: "Former VPE" },
  { name: "Kasun", role: "Former VPM" },
  { name: "Albin", role: "Former VPPR" },
];

/** The standard structure of a regular meeting, drawn from real club agendas. */
export const meetingFlow = [
  {
    phase: "Opening Ceremony",
    description:
      "Sign-in, call to order, the President's opening remarks, and role introductions (General Evaluator, Timer, Ah-Counter, Grammarian).",
  },
  {
    phase: "Table Topics",
    description:
      "Impromptu 1–2 minute speeches on a surprise topic — the heart of thinking-on-your-feet practice.",
  },
  {
    phase: "Guest Welcome",
    description: "Guests introduce themselves, followed by a short networking and coffee break.",
  },
  {
    phase: "Prepared Speeches",
    description:
      "Members deliver rehearsed speeches (typically 2, occasionally a 4-speech \"Speech Marathon\" format), each timed on the club's Green/Yellow/Red card system.",
  },
  {
    phase: "Evaluations",
    description: "Individual speech evaluations, followed by Timer, Ah-Counter, and Grammarian reports.",
  },
  {
    phase: "Workshop",
    description:
      "A short interactive session on a communication or leadership skill (skipped on Speech Marathon nights in favor of extra speeches).",
  },
  {
    phase: "Closing",
    description: "General evaluation, voting, awards, and meeting close.",
  },
] as const;

export const timerSystem = {
  green: { label: "Green Card", meaning: "Minimum qualifying time reached" },
  yellow: { label: "Yellow Card", meaning: "30 seconds to 1 minute remaining" },
  red: { label: "Red Card", meaning: "Time is up — wrap up within 30 seconds" },
} as const;
