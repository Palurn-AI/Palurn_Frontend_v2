import { logAction } from "./log-action.ts";
import { useState } from "react";
import { Link } from "react-router";

import avatarA from "./assets/projects/avatar-a.png";
import avatarB from "./assets/projects/avatar-b.png";
import avatarC from "./assets/projects/avatar-c.png";
import avatarPraise from "./assets/projects/avatar-praise.png";
import checkIcon from "./assets/projects/check.svg";
import commentIcon from "./assets/projects/comment.svg";
import logoDatabricks from "./assets/projects/logo-databricks.svg";
import logoOutreach from "./assets/projects/logo-outreach.svg";
import starFilled from "./assets/projects/star-filled.svg";
import starIcon from "./assets/projects/star.svg";
import subtaskIcon from "./assets/projects/subtask.svg";
import taskDots from "./assets/meetings/task-dots.svg";
import backIcon from "./assets/tasks/back.svg";
import editButtonIcon from "./assets/tasks/edit.svg";
import filesChevron from "./assets/tasks/files-chevron.svg";
import cakeIcon from "./assets/team/cake.svg";
import copyIcon from "./assets/team/copy.svg";
import dennisAvatar from "./assets/team/dennis.png";
import doglasAvatar from "./assets/team/doglas.png";
import editIcon from "./assets/team/edit.svg";
import genderIcon from "./assets/team/gender.svg";
import mailIcon from "./assets/team/mail.svg";
import phoneIcon from "./assets/team/phone.svg";
import pinIcon from "./assets/team/pin.svg";
import portrait from "./assets/team/portrait.png";
import praiseAvatar from "./assets/team/praise.png";
import starLabel from "./assets/team/star.svg";
import userShield from "./assets/team/user-shield.svg";
import { TeamModals, type TeamModal } from "./team-view.tsx";
import type { TeamMember } from "./team-data.ts";

const faces = [avatarA, avatarB, avatarC];
const avatars = { praise: praiseAvatar, dennis: dennisAvatar };

const projects = [
  { id: "hospital", name: "Hospital Administration", logo: logoOutreach, tasks: 8, completed: 15, status: "completed" as const, deadline: "31 July 2025" },
  { id: "video", name: "Video Calling App", logo: logoDatabricks, tasks: 22, completed: 15, status: "inprogress" as const, deadline: "16 Jan 2025" },
];

const seedTasks = [
  { id: "1", title: "Patient appointment booking", starred: true, done: false, status: "completed" as const },
  { id: "2", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "3", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "4", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "5", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "6", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "7", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "8", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "9", title: "Patient and Doctor video conferencing", starred: false, done: true, status: "inprogress" as const },
  { id: "10", title: "Private chat module", starred: false, done: true, status: "completed" as const },
];

export function TeamDetailView({ member }: { member: TeamMember }) {
  const [modal, setModal] = useState<TeamModal | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [tasks, setTasks] = useState(seedTasks);
  const portraitSrc = member.avatar === "dennis" ? portrait : avatars[member.avatar];

  return (
    <div className="flex flex-col gap-6 bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/team" className="flex items-center gap-2 text-[14px] leading-6 font-medium text-[#111827]">
          <img alt="" src={backIcon} className="size-4" />
          Back
        </Link>
        <button
          type="button"
          className="flex h-[38px] cursor-pointer items-center gap-2 rounded-[5px] bg-[#f04e1a] px-4 text-[14px] leading-6 font-medium text-white hover:bg-[#f04c16]"
          onClick={() => {
            setModal("add");
            logAction("Edit teammate profile", member.id);
          }}
        >
          <img alt="" src={editButtonIcon} className="size-3.5" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[364px_minmax(0,1fr)]">
        <article className="rounded-[5px] border border-[#e5e7eb] bg-white pt-8 shadow-[0_1px_0.5px_rgba(198,198,198,0.2)]">
          <div className="flex flex-col items-center gap-2 px-5 pb-5">
            <img alt="" src={portraitSrc} className="size-[72px] rounded-full border-2 border-white object-cover" />
            <h2 className="text-[16px] leading-6 font-semibold text-[#111827]">{member.name}</h2>
            <span className="inline-flex items-center gap-[5px] rounded-[5px] bg-[#e8e9ea] p-2 text-[10px] leading-[8px] font-medium text-[#212529]">
              <span className="size-[5px] rounded-full bg-[#212529]" />
              {member.avatar === "dennis" ? "Software Developer" : member.position}
            </span>
          </div>
          <div className="flex flex-col gap-4 px-5 pb-5">
            <InfoRow icon={starLabel} label="Team" value={member.avatar === "dennis" ? "UI/UX Design" : member.position} />
            <div className="flex items-center gap-2">
              <span className="flex min-w-0 flex-1 items-center gap-2 text-[13px] leading-4 text-[#6b7280]">
                <img alt="" src={userShield} className="size-4" />
                Reporting Officer
              </span>
              <span className="flex items-center gap-2 text-[13px] leading-4 text-[#111827]">
                <img alt="" src={doglasAvatar} className="size-6 rounded-full object-cover" />
                Doglas Martini
              </span>
            </div>
          </div>
          <div className="border-t border-[#e5e7eb] py-5">
            <div className="flex items-center px-5">
              <h3 className="min-w-0 flex-1 text-[14px] leading-4 font-semibold text-[#111827]">Basic information</h3>
              <button type="button" aria-label="Edit basic information" className="cursor-pointer" onClick={() => setModal("add")}>
                <img alt="" src={editIcon} className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Toggle basic information"
                className="ml-2 cursor-pointer"
                onClick={() => setInfoOpen((open) => !open)}
              >
                <img alt="" src={filesChevron} className={`size-4 ${infoOpen ? "" : "-rotate-90"}`} />
              </button>
            </div>
            {infoOpen ? (
              <div className="mt-4 flex flex-col gap-5 px-5">
                <InfoRow icon={phoneIcon} label="Phone" value="+1 458 7877 879" />
                <div className="flex items-center gap-1">
                  <span className="flex min-w-0 flex-1 items-center gap-2 text-[13px] leading-4 text-[#6b7280]">
                    <img alt="" src={mailIcon} className="size-4" />
                    Email
                  </span>
                  <span className="text-[14px] leading-6 text-[#3290ff]">{member.avatar === "dennis" ? "perralt12@example.com" : member.email}</span>
                  <button
                    type="button"
                    aria-label="Copy email"
                    className="cursor-pointer"
                    onClick={() => {
                      void navigator.clipboard?.writeText(member.avatar === "dennis" ? "perralt12@example.com" : member.email);
                      logAction("Copy teammate email");
                    }}
                  >
                    <img alt="" src={copyIcon} className="size-3.5" />
                  </button>
                </div>
                <InfoRow icon={genderIcon} label="Gender" value="Male" />
                <InfoRow icon={cakeIcon} label="Birdthday" value="24th July 2000" />
                <InfoRow icon={pinIcon} label="Address" value="1861 Bayonne Ave, Manchester, NJ, 08759" align="right" />
              </div>
            ) : null}
          </div>
        </article>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="rounded-[5px] border border-[#e5e7eb] bg-white">
            <header className="flex items-center px-5 py-4">
              <h3 className="min-w-0 flex-1 text-[16px] leading-6 font-semibold text-[#111827]">Projects</h3>
              <button type="button" aria-label="Toggle projects" className="cursor-pointer" onClick={() => setProjectsOpen((open) => !open)}>
                <img alt="" src={filesChevron} className={`size-4 ${projectsOpen ? "" : "-rotate-90"}`} />
              </button>
            </header>
            {projectsOpen ? (
              <div className="grid grid-cols-1 gap-3 px-5 pb-5 lg:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-[5px] border border-[#e5e7eb] bg-white">
            <header className="flex items-center px-5 py-4">
              <h3 className="min-w-0 flex-1 text-[16px] leading-6 font-semibold text-[#111827]">Tasks</h3>
              <button type="button" aria-label="Toggle tasks" className="cursor-pointer" onClick={() => setTasksOpen((open) => !open)}>
                <img alt="" src={filesChevron} className={`size-4 ${tasksOpen ? "" : "-rotate-90"}`} />
              </button>
            </header>
            {tasksOpen ? (
              <div className="flex flex-col gap-2 px-5 pb-5">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 rounded-[5px] border border-[#e5e7eb] bg-white p-2">
                    <button
                      type="button"
                      aria-label={task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                      className={task.done ? "relative size-4 shrink-0 cursor-pointer rounded-[5px] border border-[#f26522] bg-[#f26522]" : "size-4 shrink-0 cursor-pointer rounded-[5px] border border-[#e5e7eb] bg-white"}
                      onClick={() => setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)))}
                    >
                      {task.done ? <img alt="" src={checkIcon} className="absolute top-[3px] left-[3px] size-2.5" /> : null}
                    </button>
                    <button
                      type="button"
                      aria-label={task.starred ? "Unstar task" : "Star task"}
                      className="cursor-pointer"
                      onClick={() => setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, starred: !item.starred } : item)))}
                    >
                      <img alt="" src={task.starred ? starFilled : starIcon} className="size-3.5" />
                    </button>
                    <span className="min-w-0 flex-1 truncate text-[14px] leading-6 font-medium text-[#111827]">{task.title}</span>
                    <span
                      className={
                        task.status === "completed"
                          ? "inline-flex shrink-0 items-center gap-1.5 rounded-[16px] bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#037847]"
                          : "inline-flex shrink-0 items-center gap-1.5 rounded-[16px] bg-[rgba(142,36,170,0.05)] py-0.5 pr-2 pl-1.5 font-[Inter,sans-serif] text-[10px] leading-[18px] text-[#8e24aa]"
                      }
                    >
                      <span className={`size-2 rounded-full ${task.status === "completed" ? "bg-[#037847]" : "bg-[#8e24aa]"}`} />
                      {task.status === "completed" ? "Completed" : "Inprogress"}
                    </span>
                    <button type="button" aria-label={`More actions for ${task.title}`} className="cursor-pointer rounded p-0.5" onClick={() => logAction("Open teammate task menu", task.title)}>
                      <img alt="" src={taskDots} className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <TeamModals modal={modal} onChange={setModal} onClose={() => setModal(null)} />
    </div>
  );
}

function InfoRow({ icon, label, value, align = "right" }: { icon: string; label: string; value: string; align?: "right" }) {
  return (
    <div className="flex items-start gap-2">
      <span className="flex min-w-0 flex-1 items-center gap-2 text-[13px] leading-4 text-[#6b7280]">
        <img alt="" src={icon} className="size-4 shrink-0" />
        {label}
      </span>
      <span className={`min-w-0 flex-1 text-[13px] leading-4 text-[#111827] ${align === "right" ? "text-right" : ""}`}>{value}</span>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: { name: string; logo: string; tasks: number; completed: number; status: "completed" | "inprogress"; deadline: string };
}) {
  const inProgress = project.status === "inprogress";
  return (
    <article className="flex flex-col gap-4 rounded-[5px] border border-[#e5e7eb] bg-white p-5">
      <div className="flex items-center gap-2">
        <img alt="" src={project.logo} className="size-9 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] leading-4 font-semibold text-[#111827]">{project.name}</span>
          <span className="mt-1 flex items-center gap-[5px] text-[13px] leading-4 text-[#6b7280]">
            {project.tasks} tasks
            <span className="size-1 rounded-full bg-[#d0d5dd]" />
            {project.completed} Completed
          </span>
        </span>
        <span
          className={
            inProgress
              ? "inline-flex shrink-0 items-center gap-1.5 rounded-[16px] bg-[rgba(142,36,170,0.05)] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#8e24aa]"
              : "inline-flex shrink-0 items-center gap-1.5 rounded-[16px] bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#037847]"
          }
        >
          <span className={`size-2 rounded-full ${inProgress ? "bg-[#8e24aa]" : "bg-[#037847]"}`} />
          {inProgress ? "Inprogress" : "Completed"}
        </span>
      </div>
      <div className="h-px w-full bg-[#e5e7eb]" />
      <div className="flex">
        <Meta label="Duration" value="3 Months" />
        <Meta label="Deadline" value={project.deadline} />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] leading-4 text-[#6b7280]">Project Lead</span>
          <span className="flex items-center justify-end gap-2">
            <img alt="" src={avatarPraise} className="size-4 rounded-full object-cover" />
            <span className="text-[14px] leading-6 text-[#111827]">Praise</span>
          </span>
        </span>
      </div>
      <div className="w-full bg-[#fafbfb] p-2">
        <span className="flex items-center justify-between text-[10px] leading-[8px] text-black">
          <span>23%</span>
          <span>100%</span>
        </span>
        <span className="relative mt-1 block h-[3px] w-full rounded-[30px] bg-[#03c95a]">
          <span className="absolute top-0 left-0 h-[3px] w-[23%] rounded-[30px] bg-[#ffc107]" />
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center">
          {faces.map((face, index) => (
            <img key={face} alt="" src={face} className={`size-6 rounded-full border border-white object-cover ${index > 0 ? "-ml-2.5" : ""}`} />
          ))}
        </span>
        <span className="flex items-center gap-3 font-[Inter,sans-serif] text-[12px] leading-[18px] text-[#25272d]">
          <span className="inline-flex items-center gap-1">
            2
            <img alt="" src={commentIcon} className="size-3.5" />
          </span>
          <span className="inline-flex items-center gap-1">
            5
            <img alt="" src={subtaskIcon} className="size-3.5" />
          </span>
          <span>Aug 6</span>
        </span>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block text-[13px] leading-4 text-[#6b7280]">{label}</span>
      <span className="block text-[14px] leading-6 text-[#111827]">{value}</span>
    </span>
  );
}
