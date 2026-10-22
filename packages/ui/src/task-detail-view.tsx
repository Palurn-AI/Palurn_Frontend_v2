import { logAction } from "./log-action.ts";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { TaskDetail, TaskFile, TaskPriority, TaskRecord, TaskTag, TaskWorkflowStatus } from "@palurn/api";

import { OptionMenu } from "./components/dropdown-menu.tsx";
import avatarLeona from "./assets/meetings/avatar-leona.png";
import avatarLewis from "./assets/meetings/avatar-lewis.png";
import avatarMoseley from "./assets/meetings/avatar-moseley.png";
import avatarPineiro from "./assets/meetings/avatar-pineiro.png";
import addPlus from "./assets/tasks/add-plus.svg";
import backIcon from "./assets/tasks/back.svg";
import chevronIcon from "./assets/tasks/chevron.svg";
import circlePlus from "./assets/tasks/circle-plus.svg";
import dotDone from "./assets/tasks/dot-done.svg";
import dotProgress from "./assets/tasks/dot-progress.svg";
import dotReview from "./assets/tasks/dot-review.svg";
import dotTodo from "./assets/tasks/dot-todo.svg";
import downloadIcon from "./assets/tasks/download.svg";
import editIcon from "./assets/tasks/edit.svg";
import fileDoc from "./assets/tasks/file-doc.png";
import filePdf from "./assets/tasks/file-pdf.png";
import fileZip from "./assets/tasks/file-zip.png";
import filesChevron from "./assets/tasks/files-chevron.svg";
import trashIcon from "./assets/tasks/trash.svg";

const avatars = {
  lewis: avatarLewis,
  leona: avatarLeona,
  pineiro: avatarPineiro,
  moseley: avatarMoseley,
} as const;

const fileIcons = { doc: fileDoc, pdf: filePdf, zip: fileZip } as const;

const kindLabel = { recurring: "Recurring", one_time: "One Time" } as const;
const priorityLabel: Record<TaskPriority, string> = { high: "High", medium: "Medium", low: "Low" };
const priorityClass: Record<TaskPriority, string> = {
  high: "bg-[#cc4039]",
  medium: "bg-[#03c95a]",
  low: "bg-[#9856a4]",
};
const statusLabel: Record<TaskWorkflowStatus, string> = {
  todo: "To Do",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};
const statusClass: Record<TaskWorkflowStatus, string> = {
  todo: "bg-[#f8f9fa] text-[#6b7280]",
  in_progress: "bg-[#fffbf1] text-[#d09802]",
  review: "bg-[rgba(142,36,170,0.08)] text-[#8e24aa]",
  done: "bg-[#ecfdf3] text-[#037847]",
};
const statusDot: Record<TaskWorkflowStatus, string> = {
  todo: dotTodo,
  in_progress: dotProgress,
  review: dotReview,
  done: dotDone,
};
const statusOrder: TaskWorkflowStatus[] = ["todo", "in_progress", "review", "done"];
const tagLabel: Record<TaskTag, string> = {
  ux_design: "UX Design",
  frontend: "Frontend",
  backend: "Backend",
  qa: "QA Tester",
  mobile: "Mobile",
};
const tagClass: Record<TaskTag, string> = {
  ux_design: "bg-[#eaf3ff] text-[#0066da]",
  frontend: "bg-[#eafffb] text-[#00897b]",
  backend: "bg-[#fff5f4] text-[#bf453f]",
  qa: "bg-[#fcf6fb] text-[#8a0e54]",
  mobile: "bg-[#fff5ed] text-[#f57c00]",
};

export function TaskDetailView({ task, detail }: { task: TaskRecord; detail: TaskDetail }) {
  const [status, setStatus] = useState(task.status);
  const [filesOpen, setFilesOpen] = useState(true);
  const [files, setFiles] = useState(detail.files);

  function removeFile(file: TaskFile) {
    setFiles((current) => current.filter((item) => item.id !== file.id));
    logAction("Delete task file", file.name);
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/tasks" className="flex items-center gap-2 text-[14px] leading-6 font-medium text-[#111827]">
          <img alt="" src={backIcon} className="size-4" />
          {detail.backLabel}
        </Link>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#ff541f] px-4 py-[7px] text-[14px] leading-6 font-medium text-white hover:bg-[#f04c16]"
          onClick={() => logAction("Edit task", task.id)}
        >
          <img alt="" src={editIcon} className="size-3.5" />
          {detail.editLabel}
        </button>
      </div>

      <article className="mt-6 rounded-[5px] border border-[#e5e7eb] bg-white p-5">
        <div className="flex flex-col gap-6">
          <div className="rounded-[5px] bg-[#fafbfb] p-4">
            <h1 className="text-[20px] leading-6 font-semibold text-[#111827]">{task.title}</h1>
          </div>

          <div className="flex flex-col gap-4">
            <MetaRow label="Status">
              <OptionMenu
                options={statusOrder.map((item) => statusLabel[item])}
                value={statusLabel[status]}
                onSelect={(label) => {
                  const next = statusOrder.find((item) => statusLabel[item] === label) ?? status;
                  setStatus(next);
                  logAction("Change task status", { id: task.id, status: next });
                }}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <span className={`inline-flex items-center gap-1 rounded-[5px] p-1 text-[12px] leading-4 font-medium ${statusClass[status]}`}>
                  <img alt="" src={statusDot[status]} className="size-[9px]" />
                  {statusLabel[status]}
                </span>
                <img alt="" src={chevronIcon} className="size-3" />
              </OptionMenu>
            </MetaRow>
            <MetaRow label="Assignee">
              <span className="flex flex-wrap items-center gap-2">
                {detail.assignees.map((person) => (
                  <span key={person.id} className="inline-flex items-center gap-2 rounded-[5px] bg-[#f3f4f6] p-1">
                    <img alt="" src={avatars[person.id]} className="size-6 rounded-full border border-white object-cover" />
                    <span className="pr-1 text-[12px] leading-4 font-medium text-[#111827]">{person.name}</span>
                  </span>
                ))}
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1 text-[12px] leading-4 font-medium text-[#4b5563]"
                  onClick={() => logAction("Add task assignee", task.id)}
                >
                  <img alt="" src={circlePlus} className="size-3.5" />
                  {detail.addAssigneeLabel}
                </button>
              </span>
            </MetaRow>
            <MetaRow label="Type">
              <span className="text-[14px] leading-6 text-[#111827]" style={{ fontFamily: "Inter, sans-serif" }}>
                {kindLabel[task.kind]}
              </span>
            </MetaRow>
            <MetaRow label="Priority">
              <span className={`inline-flex h-[26px] items-center gap-[5px] rounded-[5px] px-1.5 text-[12px] leading-[8px] font-medium text-white ${priorityClass[task.priority]}`}>
                <span className="size-[5px] rounded-full bg-white" />
                {priorityLabel[task.priority]}
              </span>
            </MetaRow>
            <MetaRow label="Due Date">
              <span className="text-[14px] leading-5 text-[#35383d]" style={{ fontFamily: "Inter, sans-serif" }}>
                {task.due}
              </span>
            </MetaRow>
            <MetaRow label="Tag">
              <span className={`inline-flex items-center rounded-[12px] px-3 py-1 text-[14px] leading-4 ${tagClass[task.tag]}`}>
                {tagLabel[task.tag]}
              </span>
            </MetaRow>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[14px] leading-4 font-semibold text-[#111827]">{detail.descriptionTitle}</h2>
            <p className="text-[14px] leading-6 text-[#4b5563]">{detail.description}</p>
          </div>
        </div>
      </article>

      <section className="mt-6 overflow-hidden rounded-[5px] border border-[#e5e7eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-[16px] leading-6 font-semibold text-[#111827]">{detail.filesTitle}</h2>
          <span className="flex items-center gap-2">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-[5px] bg-[#ff541f] p-2 text-[10px] leading-[8px] font-medium text-white"
              onClick={() => logAction("Add task file", task.id)}
            >
              <img alt="" src={addPlus} className="size-2" />
              {detail.addFileLabel}
            </button>
            <button
              type="button"
              className="cursor-pointer"
              aria-label="Toggle files"
              onClick={() => {
                setFilesOpen((open) => !open);
                logAction("Toggle task files");
              }}
            >
              <img alt="" src={filesChevron} className={`size-4 ${filesOpen ? "" : "-rotate-90"}`} />
            </button>
          </span>
        </div>
        {filesOpen ? (
          <div className="grid gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <FileCard key={file.id} file={file} onDownload={() => logAction("Download task file", file.name)} onDelete={() => removeFile(file)} />
            ))}
          </div>
        ) : null}
      </section>
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

function FileCard({ file, onDownload, onDelete }: { file: TaskFile; onDownload: () => void; onDelete: () => void }) {
  return (
    <article className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="flex items-center rounded-[5px] bg-[#f8f9fa] p-2">
          <img alt="" src={fileIcons[file.kind]} className="size-5 object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] leading-4 font-semibold text-[#111827]">{file.name}</span>
          <span className="mt-1 block text-[13px] leading-4 text-[#6b7280]">{file.size}</span>
        </span>
        <button type="button" className="cursor-pointer rounded-[19px] p-[5px]" aria-label={`Download ${file.name}`} onClick={onDownload}>
          <img alt="" src={downloadIcon} className="size-4" />
        </button>
        <button type="button" className="cursor-pointer rounded-[19px] p-[5px]" aria-label={`Delete ${file.name}`} onClick={onDelete}>
          <img alt="" src={trashIcon} className="size-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-[#e5e7eb] pt-2">
        <span className="min-w-0 flex-1 text-[13px] leading-4 text-[#6b7280]">{file.addedAt}</span>
        <img alt="" src={avatars[file.owner]} className="size-6 rounded-full border border-white object-cover" />
      </div>
    </article>
  );
}
