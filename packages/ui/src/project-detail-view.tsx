import { logAction } from "./log-action.ts";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { ProjectCardStatus, ProjectDetail, ProjectFile, ProjectLogo, ProjectPerson, ProjectRecord, ProjectTaskItem } from "@palurn/api";

import { OptionMenu } from "./components/dropdown-menu.tsx";
import avatarLeona from "./assets/meetings/avatar-leona.png";
import avatarLewis from "./assets/meetings/avatar-lewis.png";
import avatarMoseley from "./assets/meetings/avatar-moseley.png";
import avatarPineiro from "./assets/meetings/avatar-pineiro.png";
import moreIcon from "./assets/meetings/more.svg";
import avatarA from "./assets/projects/avatar-a.png";
import avatarB from "./assets/projects/avatar-b.png";
import avatarC from "./assets/projects/avatar-c.png";
import avatarDwight from "./assets/projects/avatar-dwight.png";
import avatarMeredith from "./assets/projects/avatar-meredith.png";
import avatarRuth from "./assets/projects/avatar-ruth.png";
import checkIcon from "./assets/projects/check.svg";
import logoDatabricks from "./assets/projects/logo-databricks.svg";
import logoOutreach from "./assets/projects/logo-outreach.svg";
import plusTask from "./assets/projects/plus-task.svg";
import starFilled from "./assets/projects/star-filled.svg";
import starIcon from "./assets/projects/star.svg";
import addPlus from "./assets/tasks/add-plus.svg";
import backIcon from "./assets/tasks/back.svg";
import chevronIcon from "./assets/tasks/chevron.svg";
import circlePlus from "./assets/tasks/circle-plus.svg";
import downloadIcon from "./assets/tasks/download.svg";
import editIcon from "./assets/tasks/edit.svg";
import fileDoc from "./assets/tasks/file-doc.png";
import filePdf from "./assets/tasks/file-pdf.png";
import fileZip from "./assets/tasks/file-zip.png";
import filesChevron from "./assets/tasks/files-chevron.svg";
import trashIcon from "./assets/tasks/trash.svg";

const logos: Record<ProjectLogo, string> = { databricks: logoDatabricks, outreach: logoOutreach };
const people: Record<string, string> = {
  lewis: avatarLewis,
  leona: avatarLeona,
  pineiro: avatarPineiro,
  moseley: avatarMoseley,
  ruth: avatarRuth,
  meredith: avatarMeredith,
  dwight: avatarDwight,
};
const taskFaces = [avatarA, avatarB, avatarC];
const fileIcons = { doc: fileDoc, pdf: filePdf, zip: fileZip } as const;

export function ProjectDetailView({ project, detail }: { project: ProjectRecord; detail: ProjectDetail }) {
  const [status, setStatus] = useState<ProjectCardStatus>(project.status);
  const [tasks, setTasks] = useState(detail.tasks);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [filesOpen, setFilesOpen] = useState(true);
  const [files, setFiles] = useState(detail.files);
  const inProgress = status === "inprogress";

  return (
    <div className="flex flex-col gap-6 bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/projects" className="flex items-center gap-2 text-[14px] leading-6 font-medium text-[#111827]">
          <img alt="" src={backIcon} className="size-4" />
          {detail.backLabel}
        </Link>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#ff541f] px-4 py-[7px] text-[14px] leading-6 font-medium text-white hover:bg-[#f04c16]"
          onClick={() => logAction("Edit project", project.id)}
        >
          <img alt="" src={editIcon} className="size-3.5" />
          {detail.editLabel}
        </button>
      </div>

      <article className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
        <div className="flex flex-col gap-4">
          <div className="rounded-[5px] bg-[#fafbfb] p-4">
            <div className="flex items-center gap-2">
              <img alt="" src={logos[project.logo]} className="size-8" />
              <div>
                <h1 className="text-[20px] leading-6 font-semibold text-[#111827]">{project.name}</h1>
                <p className="text-[14px] leading-6 text-[#4b5563]">
                  {detail.durationLabel} : <span className="text-[#f26522]">{project.duration}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Meta label="Status">
              <OptionMenu
                options={["In progress", "Completed"]}
                value={inProgress ? "In progress" : "Completed"}
                onSelect={(label) => {
                  const next = label === "Completed" ? "completed" : "inprogress";
                  setStatus(next);
                  logAction("Change project status", next);
                }}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <span className={inProgress ? "inline-flex h-[26px] items-center gap-1 rounded-[5px] bg-[#fffbf1] p-1 text-[12px] leading-4 font-medium text-[#d09802]" : "inline-flex h-[26px] items-center gap-1 rounded-[5px] bg-[#ecfdf3] p-1 text-[12px] leading-4 font-medium text-[#037847]"}>
                  <span className={`size-[9px] rounded-full ${inProgress ? "bg-[#d09802]" : "bg-[#037847]"}`} />
                  {inProgress ? "In progress" : "Completed"}
                </span>
                <img alt="" src={chevronIcon} className="size-3" />
              </OptionMenu>
            </Meta>
            <Meta label="Team">
              <People people={detail.team} onAdd={() => logAction("Add project team member")} />
            </Meta>
            <Meta label="Team Lead">
              <People people={detail.leads} onAdd={() => logAction("Add team lead")} />
            </Meta>
            <Meta label="Project Manager">
              <People people={[detail.manager]} onAdd={() => logAction("Add project manager")} />
            </Meta>
            <Meta label="Label">
              <span className="flex flex-wrap gap-2">
                {detail.labels.map((label) => (
                  <span
                    key={label.text}
                    className={`rounded-[20px] p-1.5 text-[10px] leading-[8px] font-medium text-white ${label.tone === "pink" ? "bg-[#fd3995]" : "bg-[#1b84ff]"}`}
                  >
                    {label.text}
                  </span>
                ))}
              </span>
            </Meta>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[14px] leading-4 font-semibold text-[#111827]">{detail.descriptionTitle}</h2>
            <p className="text-[14px] leading-6 text-[#4b5563]">{detail.description}</p>
          </div>
        </div>
      </article>

      <section className="overflow-hidden rounded-[5px] border border-[#e5e7eb] bg-white">
        <header className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-[16px] leading-6 font-semibold text-[#111827]">{detail.tasksTitle}</h2>
          <button
            type="button"
            aria-label="Toggle tasks"
            className="cursor-pointer"
            onClick={() => {
              setTasksOpen((open) => !open);
              logAction("Toggle project tasks");
            }}
          >
            <img alt="" src={filesChevron} className={`size-4 ${tasksOpen ? "" : "-rotate-90"}`} />
          </button>
        </header>
        {tasksOpen ? (
          <div className="flex flex-col gap-2 p-5">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => {
                  setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)));
                  logAction("Toggle project task", task.title);
                }}
                onStar={() => {
                  setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, starred: !item.starred } : item)));
                  logAction("Star project task", task.title);
                }}
              />
            ))}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-[5px] border border-dashed border-[#f26522] bg-[#fef1eb] p-2 text-[13px] leading-4 font-medium text-[#f26522]"
              onClick={() => {
                setTasks((current) => [...current, { id: `pt_${Date.now()}`, title: "New task", done: false, starred: false, status: "inprogress", faces: 2 }]);
                logAction("Add project task");
              }}
            >
              <img alt="" src={plusTask} className="size-3.5" />
              {detail.newTaskLabel}
            </button>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-[5px] border border-[#e5e7eb] bg-white">
        <header className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-[16px] leading-6 font-semibold text-[#111827]">{detail.filesTitle}</h2>
          <span className="flex items-center gap-2">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-[5px] bg-[#ff541f] p-2 text-[10px] leading-[8px] font-medium text-white"
              onClick={() => logAction("Add project file")}
            >
              <img alt="" src={addPlus} className="size-2" />
              {detail.addFileLabel}
            </button>
            <button
              type="button"
              aria-label="Toggle files"
              className="cursor-pointer"
              onClick={() => {
                setFilesOpen((open) => !open);
                logAction("Toggle project files");
              }}
            >
              <img alt="" src={filesChevron} className={`size-4 ${filesOpen ? "" : "-rotate-90"}`} />
            </button>
          </span>
        </header>
        {filesOpen ? (
          <div className="grid gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={() => logAction("Download project file", file.name)}
                onDelete={() => {
                  setFiles((current) => current.filter((item) => item.id !== file.id));
                  logAction("Delete project file", file.name);
                }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-full shrink-0 text-[13px] leading-4 text-[#6b7280] sm:w-[150px]">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function People({ people: group, onAdd }: { people: ProjectPerson[]; onAdd: () => void }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {group.map((person) => (
        <span key={person.id} className="inline-flex items-center gap-2 rounded-[5px] bg-[#f3f4f6] p-1">
          <img alt="" src={people[person.id]} className="size-6 rounded-full border border-white object-cover" />
          <span className="pr-1 text-[12px] leading-4 font-medium text-[#111827]">{person.name}</span>
        </span>
      ))}
      <button type="button" className="inline-flex cursor-pointer items-center gap-1 text-[12px] leading-4 font-medium text-[#4b5563]" onClick={onAdd}>
        <img alt="" src={circlePlus} className="size-3.5" />
        Add New
      </button>
    </span>
  );
}

function TaskRow({ task, onToggle, onStar }: { task: ProjectTaskItem; onToggle: () => void; onStar: () => void }) {
  const inProgress = task.status === "inprogress";
  return (
    <div className="flex items-center gap-2 rounded-[5px] border border-[#e5e7eb] bg-white p-2">
      <button
        type="button"
        aria-label={task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
        className={task.done ? "relative size-4 shrink-0 cursor-pointer rounded-[5px] border border-[#f26522] bg-[#f26522]" : "size-4 shrink-0 cursor-pointer rounded-[5px] border border-[#e5e7eb] bg-white"}
        onClick={onToggle}
      >
        {task.done ? <img alt="" src={checkIcon} className="absolute top-[3px] left-[3px] size-2.5" /> : null}
      </button>
      <button type="button" aria-label={task.starred ? "Unstar task" : "Star task"} className="cursor-pointer" onClick={onStar}>
        <img alt="" src={task.starred ? starFilled : starIcon} className="size-3.5" />
      </button>
      <span className="min-w-0 flex-1 truncate text-[14px] leading-6 font-medium text-[#111827]">{task.title}</span>
      <span className={inProgress ? "inline-flex items-center gap-1.5 rounded-[16px] bg-[rgba(142,36,170,0.05)] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#8e24aa]" : "inline-flex items-center gap-1.5 rounded-[16px] bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#037847]"} style={{ fontFamily: inProgress ? "Inter, sans-serif" : undefined }}>
        <span className={`size-2 rounded-full ${inProgress ? "bg-[#8e24aa]" : "bg-[#037847]"}`} />
        {inProgress ? "Inprogress" : "Completed"}
      </span>
      <span className="flex items-center">
        {taskFaces.slice(0, task.faces).map((face, index) => (
          <img key={`${task.id}-${index}`} alt="" src={face} className={`size-6 rounded-full border border-white object-cover ${index > 0 ? "-ml-2.5" : ""}`} />
        ))}
      </span>
      <button type="button" aria-label={`More actions for ${task.title}`} className="cursor-pointer rounded p-0.5" onClick={() => logAction("Open project task menu", task.title)}>
        <img alt="" src={moreIcon} className="size-3.5" />
      </button>
    </div>
  );
}

function FileCard({ file, onDownload, onDelete }: { file: ProjectFile; onDownload: () => void; onDelete: () => void }) {
  return (
    <article className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="rounded-[5px] bg-[#f8f9fa] p-2">
          <img alt="" src={fileIcons[file.kind]} className="size-5 object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] leading-4 font-semibold text-[#111827]">{file.name}</span>
          <span className="mt-1 block text-[13px] leading-4 text-[#6b7280]">{file.size}</span>
        </span>
        <button type="button" className="cursor-pointer rounded-[19px] p-[5px]" aria-label={`Download ${file.name}`} onClick={onDownload}>
          <img alt="" src={downloadIcon} className="size-4" />
        </button>
        <button type="button" className="cursor-pointer rounded-[19px] p-[5px]" aria-label={`Remove ${file.name}`} onClick={onDelete}>
          <img alt="" src={trashIcon} className="size-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-[#e5e7eb] pt-2">
        <span className="min-w-0 flex-1 text-[13px] leading-4 text-[#6b7280]">{file.addedAt}</span>
        <img alt="" src={people[file.owner]} className="size-6 rounded-full border border-white object-cover" />
      </div>
    </article>
  );
}
