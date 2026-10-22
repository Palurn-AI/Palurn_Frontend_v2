import { logAction } from "./log-action.ts";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { MeetingDetail, MeetingRecord, MeetingTaskItem, MeetingTranscriptLine } from "@palurn/api";

import avatarLeona from "./assets/meetings/avatar-leona.png";
import avatarLewis from "./assets/meetings/avatar-lewis.png";
import avatarMoseley from "./assets/meetings/avatar-moseley.png";
import avatarPineiro from "./assets/meetings/avatar-pineiro.png";
import avatarPraise from "./assets/meetings/avatar-praise.png";
import backIcon from "./assets/meetings/back.svg";
import blinkDot from "./assets/meetings/blink-dot.svg";
import blinkGreen from "./assets/meetings/blink-green.svg";
import notStartedArt from "./assets/meetings/not-started.png";
import plusIcon from "./assets/meetings/plus.svg";
import tabAttendanceActive from "./assets/meetings/tab-attendance-active.svg";
import tabHighlights from "./assets/meetings/tab-highlights.svg";
import tabHighlightsActive from "./assets/meetings/tab-highlights-active.svg";
import tabPeople from "./assets/meetings/tab-people.svg";
import tabSpeakersActive from "./assets/meetings/tab-speakers-active.svg";
import tabSummary from "./assets/meetings/tab-summary.svg";
import tabSummaryIdle from "./assets/meetings/tab-summary-idle.svg";
import tabTasks from "./assets/meetings/tab-tasks.svg";
import tabTasksActive from "./assets/meetings/tab-tasks-active.svg";
import tabTranscript from "./assets/meetings/tab-transcript.svg";
import tabTranscriptIdle from "./assets/meetings/tab-transcript-idle.svg";
import taskCheck from "./assets/meetings/task-check.svg";
import taskChevron from "./assets/meetings/task-chevron.svg";
import taskDotDone from "./assets/meetings/task-dot-done.svg";
import taskDotProgress from "./assets/meetings/task-dot-progress.svg";
import taskDots from "./assets/meetings/task-dots.svg";
import taskStar from "./assets/meetings/task-star.svg";
import taskStarFilled from "./assets/meetings/task-star-filled.svg";

const avatars = {
  lewis: avatarLewis,
  leona: avatarLeona,
  pineiro: avatarPineiro,
  moseley: avatarMoseley,
} as const;

const leftTabs = [
  {
    id: "summary",
    label: "Summary",
    activeIcon: tabSummary,
    idleIcon: tabSummaryIdle,
    font: "Inter, sans-serif",
    weight: "font-medium",
    idle: "text-[#35383d]",
  },
  {
    id: "tasks",
    label: "Tasks",
    activeIcon: tabTasksActive,
    idleIcon: tabTasks,
    font: "Inter, sans-serif",
    weight: "font-normal",
    idle: "text-[#35383d]",
  },
  {
    id: "highlights",
    label: "Highlights",
    activeIcon: tabHighlightsActive,
    idleIcon: tabHighlights,
    font: "Archivo, sans-serif",
    weight: "font-normal",
    idle: "text-[#111827]",
  },
] as const;

const rightTabs = [
  { id: "transcript", label: "Transcript", activeIcon: tabTranscript, idleIcon: tabTranscriptIdle },
  { id: "attendance", label: "Attendance", activeIcon: tabAttendanceActive, idleIcon: tabPeople },
  { id: "speakers", label: "Speakers", activeIcon: tabSpeakersActive, idleIcon: tabPeople },
] as const;

export function MeetingDetailView({ meeting, detail }: { meeting: MeetingRecord; detail: MeetingDetail }) {
  const [leftTab, setLeftTab] = useState<(typeof leftTabs)[number]["id"]>("summary");
  const [rightTab, setRightTab] = useState<(typeof rightTabs)[number]["id"]>("transcript");
  const [tasks, setTasks] = useState<MeetingTaskItem[]>(detail.tasks);
  const [tasksOpen, setTasksOpen] = useState(true);
  const completed = meeting.status === "done";

  function toggleTask(id: string, field: "done" | "starred") {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, [field]: !task[field] } : task)),
    );
    logAction("meeting.task.toggle", { id, field });
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:px-6">
      <div className="grid items-start gap-[9px] xl:grid-cols-[minmax(0,1.26fr)_minmax(320px,1fr)]">
        <article className="overflow-hidden rounded-[12px] bg-white">
          <div className="flex h-[66px] items-center border-b border-[#e2e4e9] px-4 sm:px-6">
            <Link to="/meetings" className="flex items-center gap-1.5 text-[16px] leading-8 text-[#16151c]">
              <span className="flex size-6 items-center justify-center">
                <img alt="" src={backIcon} className="h-[15px] w-5" />
              </span>
              {detail.backLabel}
            </Link>
          </div>
          <div className="px-4 pt-[17px] pb-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[20px] leading-[22px] font-medium text-black">{meeting.title}</h1>
              {completed ? null : (
                <button
                  type="button"
                  className="flex h-[26px] w-[100px] shrink-0 cursor-pointer items-center justify-center rounded-[3px] bg-[#f04e1a] text-[12px] font-medium text-white"
                  onClick={() => {
                    logAction("meeting.join", detail.link);
                    window.open(`https://${detail.link}`, "_blank", "noopener,noreferrer");
                  }}
                >
                  Join Meeting
                </button>
              )}
            </div>
            <p className="mt-0.5 text-[14px] leading-[22px] text-[#6b7280]">{detail.link}</p>

            <div className="mt-[17px] flex flex-col gap-4">
              <MetaRow label="Status">
                <span
                  className={
                    completed
                      ? "inline-flex items-center gap-1 rounded-[5px] bg-[#f5fef3] p-1 text-[12px] leading-4 font-medium text-[#2e7d32]"
                      : "inline-flex items-center gap-1 rounded-[5px] bg-[rgba(142,36,170,0.05)] p-1 text-[12px] leading-4 font-medium text-[#8e24aa]"
                  }
                >
                  <img alt="" src={completed ? blinkGreen : blinkDot} className="size-[9px]" />
                  {completed ? "Completed" : "Upcoming"}
                </span>
              </MetaRow>
              <MetaRow label="Owner">
                <span className="text-[12px] leading-4 text-[#35383d]">{detail.owner}</span>
              </MetaRow>
              <MetaRow label="Date & Time">
                <span className="flex flex-wrap items-center gap-4 text-[12px] leading-4 text-[#35383d]">
                  <span>{detail.date}</span>
                  <img alt="" src={blinkDot} className="size-[9px]" />
                  <span>{detail.time}</span>
                  <img alt="" src={blinkDot} className="size-[9px]" />
                  <span>{detail.duration}</span>
                </span>
              </MetaRow>
              <MetaRow label="Attendees">
                <span className="flex flex-wrap items-center gap-2">
                  {detail.attendees.map((person) => (
                    <span key={person.name} className="inline-flex items-center gap-2 rounded-[5px] bg-[#f3f4f6] p-1">
                      <img alt="" src={avatars[person.avatar]} className="size-6 rounded-full border border-white object-cover" />
                      <span className="pr-1 text-[12px] leading-4 font-medium text-[#111827]">{person.name}</span>
                    </span>
                  ))}
                  <span className="inline-flex h-8 items-center gap-0.5 rounded-[5px] bg-[#f3f4f6] p-1">
                    <img alt="" src={plusIcon} className="size-4" />
                    <span className="pr-1 text-[12px] leading-4 font-medium text-[#111827]">{detail.moreLabel}</span>
                  </span>
                </span>
              </MetaRow>
            </div>

            <div className="mt-6 overflow-x-auto border-b border-[#e2e4e9] pt-3">
              <div className="flex min-w-max items-start gap-1.5">
                {leftTabs.map((tab) => {
                  const active = tab.id === leftTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={active ? "cursor-pointer border-b-2 border-[#ff541f] pb-2" : "cursor-pointer pb-2"}
                      onClick={() => {
                        setLeftTab(tab.id);
                        logAction("meeting.tab", tab.id);
                      }}
                    >
                      <span className="flex items-center gap-1.5 rounded px-2 py-[3px]">
                        <img alt="" src={active ? tab.activeIcon : tab.idleIcon} className="size-4" />
                        <span
                          className={`text-[14px] leading-[22px] ${tab.weight} ${active ? "text-[#ff541f]" : tab.idle}`}
                          style={{ fontFamily: tab.font }}
                        >
                          {tab.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              {completed ? null : <NotStartedPanel />}
              {completed && leftTab === "summary" ? (
                <div className="flex flex-col gap-8">
                  <CopyBlock title={detail.overviewTitle} paragraphs={detail.overview} />
                  <CopyBlock title={detail.keyPointsTitle} paragraphs={detail.keyPoints} />
                </div>
              ) : null}
              {completed && leftTab === "tasks" ? (
                <TaskList
                  title={detail.tasksTitle}
                  tasks={tasks}
                  open={tasksOpen}
                  onToggleOpen={() => {
                    setTasksOpen((open) => !open);
                    logAction("meeting.tasks.toggle");
                  }}
                  onToggle={toggleTask}
                />
              ) : null}
              {completed && leftTab === "highlights" ? <QuestionList title={detail.questionsTitle} questions={detail.questions} /> : null}
            </div>
          </div>
        </article>

        <aside className="overflow-hidden rounded-[12px] bg-white pb-6">
          <div className="px-[18px] pt-[14px]">
            <div className="overflow-x-auto border-b border-[#e2e4e9] pt-3">
              <div className="flex min-w-max items-start gap-1.5">
                {rightTabs.map((tab) => {
                  const active = tab.id === rightTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={active ? "cursor-pointer border-b-2 border-[#ff541f] pb-2" : "cursor-pointer pb-2"}
                      onClick={() => {
                        setRightTab(tab.id);
                        logAction("meeting.tab", tab.id);
                      }}
                    >
                      <span className="flex items-center gap-1.5 rounded px-2 py-[3px]">
                        <img alt="" src={active ? tab.activeIcon : tab.idleIcon} className="size-4" />
                        <span className={`text-[14px] leading-[22px] font-normal ${active ? "text-[#ff541f]" : "text-[#111827]"}`}>
                          {tab.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {completed ? null : (
            <div className="flex min-h-[640px] items-center justify-center px-6">
              <img alt="" src={notStartedArt} className="h-[140px] w-[200px] object-contain" />
            </div>
          )}
          {completed && rightTab === "attendance" ? (
            <AttendanceTable rows={detail.attendance} />
          ) : null}
          {completed && rightTab !== "attendance" ? (
            <div className="mt-3 flex flex-col gap-3 px-[18px]">
              {(rightTab === "transcript" || rightTab === "speakers") &&
                detail.transcript.map((line, index) => (
                  <TranscriptLine key={`${line.name}-${index}`} line={line} connect={index < detail.transcript.length - 1} />
                ))}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function NotStartedPanel() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 pt-6 pb-10 text-center">
      <img alt="" src={notStartedArt} className="h-[140px] w-[200px] object-contain" />
      <p className="mt-6 text-[16px] leading-6 font-medium text-[#111827]">Meeting has not started yet!</p>
      <p className="mt-1 text-[14px] leading-6 text-[#6b7280]">Join meeting to .......</p>
    </div>
  );
}

function TaskList({
  title,
  tasks,
  open,
  onToggleOpen,
  onToggle,
}: {
  title: string;
  tasks: MeetingTaskItem[];
  open: boolean;
  onToggleOpen: () => void;
  onToggle: (id: string, field: "done" | "starred") => void;
}) {
  return (
    <div>
      <div className="flex h-8 items-center justify-between pt-2 pr-3 pb-4 pl-1.5">
        <h2 className="text-[14px] leading-6 font-semibold text-[#111827]">{title}</h2>
        <button type="button" className="cursor-pointer" onClick={onToggleOpen} aria-label="Toggle tasks">
          <img alt="" src={taskChevron} className={`size-4 ${open ? "" : "-rotate-90"}`} />
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-2 px-1.5">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 rounded-[5px] border border-[#e5e7eb] bg-white p-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <button
                  type="button"
                  aria-pressed={task.done}
                  className={
                    task.done
                      ? "relative size-4 shrink-0 cursor-pointer rounded-[5px] border border-[#f26522] bg-[#f26522]"
                      : "size-4 shrink-0 cursor-pointer rounded-[5px] border border-[#e5e7eb] bg-white"
                  }
                  onClick={() => onToggle(task.id, "done")}
                >
                  {task.done ? <img alt="" src={taskCheck} className="absolute top-[3px] left-[3px] size-2.5" /> : null}
                </button>
                <button type="button" className="cursor-pointer" onClick={() => onToggle(task.id, "starred")} aria-label="Star task">
                  <img alt="" src={task.starred ? taskStarFilled : taskStar} className="size-3.5" />
                </button>
                <p className="min-w-0 truncate text-[14px] leading-6 font-medium text-[#111827]">{task.title}</p>
              </div>
              {task.status === "completed" ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#037847]">
                  <img alt="" src={taskDotDone} className="size-2" />
                  Completed
                </span>
              ) : (
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-[rgba(142,36,170,0.05)] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#8e24aa]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <img alt="" src={taskDotProgress} className="size-2" />
                  Inprogress
                </span>
              )}
              <span className="flex shrink-0 items-center">
                <img alt="" src={avatarLewis} className="size-6 rounded-full border border-white object-cover" />
                <img alt="" src={avatarLeona} className="-ml-2.5 size-6 rounded-full border border-white object-cover" />
              </span>
              <button
                type="button"
                className="cursor-pointer rounded-[19px] p-0.5"
                aria-label="Task actions"
                onClick={() => logAction("meeting.task.menu", task.id)}
              >
                <img alt="" src={taskDots} className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function QuestionList({ title, questions }: { title: string; questions: MeetingDetail["questions"] }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="flex h-8 items-center text-[14px] leading-4 font-semibold text-[#111827]">{title}</h2>
      {questions.map((question, index) => (
        <div key={`${question.name}-${index}`} className="flex gap-4 p-2">
          <img alt="" src={avatarLeona} className="size-6 shrink-0 rounded-full border border-white object-cover" />
          <div className="min-w-0">
            <p className="text-[14px] leading-6 font-semibold text-[#111827]">{question.name}</p>
            <p className="text-[14px] leading-6 text-[#4b5563]">{question.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TranscriptLine({ line, connect }: { line: MeetingTranscriptLine; connect: boolean }) {
  return (
    <div className="flex items-stretch gap-4 p-2">
      <div className="relative w-6 shrink-0">
        <img alt="" src={avatarLeona} className="relative z-10 size-6 rounded-full border border-white bg-white object-cover" />
        {connect ? (
          <span className="absolute top-6 left-1/2 z-0 h-[calc(100%+5px)] w-px -translate-x-1/2 bg-[#e5e7eb]" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex gap-1 text-[14px] leading-6">
          <span className="font-medium text-[#111827]">{line.name}</span>
          <span className="text-[#4b5563]">{line.time}</span>
        </p>
        <p className="text-[14px] leading-6 text-[#4b5563]">{line.text}</p>
      </div>
    </div>
  );
}

function AttendanceTable({ rows }: { rows: MeetingDetail["attendance"] }) {
  return (
    <div className="mt-3">
      <div className="flex h-[54px] items-center justify-between border-b border-[#eaecf0] bg-[#fcfcfd] px-6">
        {["Attendance List", "Joined", "Time spent", "Left"].map((label) => (
          <span key={label} className="text-[14px] leading-[18px] font-medium text-black">
            {label}
          </span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div key={`${row.name}-${index}`} className="flex h-[54px] items-center justify-between border-b border-[#eaecf0] px-6">
          <span className="inline-flex items-center gap-1.5 text-[16px] leading-6 text-[#111827]" style={{ fontFamily: "Inter, sans-serif" }}>
            <img alt="" src={avatarPraise} className="size-5 rounded-full object-cover" />
            {row.name}
          </span>
          <span className="text-[16px] leading-6 text-[#56575a]" style={{ fontFamily: "Inter, sans-serif" }}>{row.joined}</span>
          <span className="text-[16px] leading-6 text-[#56575a]" style={{ fontFamily: "Inter, sans-serif" }}>{row.spent}</span>
          <span className="text-[16px] leading-6 text-[#56575a]" style={{ fontFamily: "Inter, sans-serif" }}>{row.left}</span>
        </div>
      ))}
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-full shrink-0 text-[13px] leading-4 text-[#6b7280] sm:w-[150px]">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CopyBlock({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[14px] leading-4 font-semibold text-[#111827]">{title}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-[14px] leading-6 text-[#4b5563]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
