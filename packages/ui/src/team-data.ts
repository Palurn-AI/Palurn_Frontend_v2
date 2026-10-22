export type TeamDept = "ux" | "backend" | "frontend";
export type TeamStatus = "active" | "inactive";
export type TeamAvatar = "praise" | "dennis";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  dept: TeamDept;
  position: string;
  status: TeamStatus;
  updated: string;
  selected: boolean;
  avatar: TeamAvatar;
};

export const teamMembers: TeamMember[] = [
  { id: "tm_1", name: "Praise Nnamudi", email: "Praise@palurnai.com", dept: "ux", position: "Ux Designer", status: "active", updated: "2nd feb 2026", selected: true, avatar: "praise" },
  { id: "tm_2", name: "Dennis Stubborn", email: "Praise@palurnai.com", dept: "backend", position: "Frontend Dev", status: "active", updated: "3rd feb 2026", selected: true, avatar: "dennis" },
  { id: "tm_3", name: "Praise Nnamudi", email: "Praise@palurnai.com", dept: "frontend", position: "Ux Designer", status: "inactive", updated: "3rd feb 2026", selected: true, avatar: "praise" },
  { id: "tm_4", name: "Dennis Stubborn", email: "Praise@palurnai.com", dept: "backend", position: "Frontend Dev", status: "active", updated: "3rd feb 2026", selected: true, avatar: "dennis" },
  { id: "tm_5", name: "Praise Nnamudi", email: "Praise@palurnai.com", dept: "frontend", position: "Ux Designer", status: "inactive", updated: "3rd feb 2026", selected: true, avatar: "praise" },
  { id: "tm_6", name: "Dennis Stubborn", email: "Praise@palurnai.com", dept: "ux", position: "Frontend Dev", status: "active", updated: "3rd feb 2026", selected: true, avatar: "dennis" },
  { id: "tm_7", name: "Praise Nnamudi", email: "Praise@palurnai.com", dept: "frontend", position: "Ux Designer", status: "active", updated: "3rd feb 2026", selected: false, avatar: "praise" },
  { id: "tm_8", name: "Praise Nnamudi", email: "Praise@palurnai.com", dept: "ux", position: "Frontend Dev", status: "active", updated: "3rd feb 2026", selected: false, avatar: "praise" },
];

export const deptLabel: Record<TeamDept, string> = {
  ux: "UX Design",
  backend: "Backend",
  frontend: "Frontend",
};

export const deptClass: Record<TeamDept, string> = {
  ux: "bg-[#eaf3ff] text-[#0066da]",
  backend: "bg-[#fff5f4] text-[#bf453f]",
  frontend: "bg-[#eafffb] text-[#00897b]",
};
