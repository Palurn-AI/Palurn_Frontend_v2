import { logAction } from "./log-action.ts";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import type { ProjectLogo, ProjectRecord, ProjectsResponse } from "@palurn/api";

import { OptionMenu } from "./components/dropdown-menu.tsx";
import { DateRangeFields, SuccessDialog } from "./dashboard-modals.tsx";
import blinkIcon from "./assets/dashboard/modal-blink.svg";
import chevronIcon from "./assets/dashboard/modal-chevron.svg";
import closeIcon from "./assets/dashboard/modal-close.svg";
import taskDots from "./assets/meetings/task-dots.svg";
import chevronDownIcon from "./assets/meetings/chevron-down.svg";
import exportIcon from "./assets/meetings/export.svg";
import filterIcon from "./assets/meetings/filter.svg";
import sortIcon from "./assets/meetings/sort.svg";
import avatarA from "./assets/projects/avatar-a.png";
import avatarB from "./assets/projects/avatar-b.png";
import avatarC from "./assets/projects/avatar-c.png";
import addPlus from "./assets/projects/add-plus.svg";
import avatarPraise from "./assets/projects/avatar-praise.png";
import checkIcon from "./assets/projects/check.svg";
import commentIcon from "./assets/projects/comment.svg";
import logoDatabricks from "./assets/projects/logo-databricks.svg";
import logoOutreach from "./assets/projects/logo-outreach.svg";
import starFilled from "./assets/projects/star-filled.svg";
import starIcon from "./assets/projects/star.svg";
import subtaskIcon from "./assets/projects/subtask.svg";
import uploadIcon from "./assets/projects/cloud-upload.svg";
import plusIcon from "./assets/tasks/plus.svg";

const logos: Record<ProjectLogo, string> = {
  databricks: logoDatabricks,
  outreach: logoOutreach,
};

const faces = [avatarA, avatarB, avatarC];

type ProjectModal = "create" | "success";

const fieldClass =
  "h-[46px] w-full rounded-[5px] border border-[#f2f3f5] bg-[#fdfdfd] px-5 text-[14px] leading-6 text-[#35383d] outline-none placeholder:text-[#6b6b6b] focus:border-[#009ddc]";

const projectStatuses = ["To Do", "In Progress", "Review"];
const projectLeads = ["Lewis", "Leona", "Pineiro", "Moseley", "Ruth", "Meredith", "Dwight"];
const projectPriorities = ["High", "Medium", "Low"];

const seedTasks = [
  { id: "task-1", title: "Patient appointment booking", starred: true, done: false, status: "inprogress" as const },
  { id: "task-2", title: "Appointment booking with payment gateway", starred: false, done: false, status: "inprogress" as const },
  { id: "task-3", title: "Patient and Doctor video conferencing", starred: false, done: true, status: "completed" as const },
];

export function ProjectsView({ data }: { data: ProjectsResponse }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ProjectModal | null>(null);

  return (
    <div className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center justify-center gap-[10px] rounded-[4px] bg-[#ff541f] px-4 text-[14px] leading-normal font-normal text-white hover:bg-[#f04c16]"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={() => {
            setModal("create");
            logAction("Open create project");
          }}
        >
          <img alt="" src={plusIcon} className="size-4" />
          {data.createLabel}
        </button>
      </div>

      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#eaecf0] px-4 pt-5 pb-[19px] sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] leading-7 font-medium text-[#101828]">{data.listTitle}</h2>
            <p className="mt-1 text-[14px] leading-5 text-[#6b7280]" style={{ fontFamily: "Lato, sans-serif" }}>
              {data.listSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] leading-5 font-medium text-[#344054] hover:bg-[#f9fafb]"
                style={{ fontFamily: "Inter, sans-serif" }}
                onClick={() => logAction("Open project filters")}
              >
                <img alt="" src={filterIcon} className="size-5" />
                Filters
              </button>
              <button
                type="button"
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded px-2 text-[14px] leading-[22px] font-medium text-[#111827] hover:bg-[#f9fafb]"
                style={{ fontFamily: "Inter, sans-serif" }}
                onClick={() => logAction("Sort projects")}
              >
                <img alt="" src={sortIcon} className="size-4" />
                Sort
              </button>
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-[5px] px-2 py-0.5 text-[14px] leading-6 text-[#111827] hover:bg-[#f9fafb]"
              onClick={() => logAction("Export projects")}
            >
              <img alt="" src={exportIcon} className="size-3.5" />
              Export
              <img alt="" src={chevronDownIcon} className="size-3" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2 xl:grid-cols-3">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/projects/${project.id}`)} />
          ))}
        </div>
      </section>

      <ProjectModals modal={modal} onChange={setModal} onClose={() => setModal(null)} />
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: ProjectRecord; onOpen: () => void }) {
  const inProgress = project.status === "inprogress";
  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col gap-4 rounded-[5px] border border-[#e5e7eb] bg-white p-5 text-left hover:border-[#d0d5dd]"
      onClick={onOpen}
    >
      <div className="flex items-center gap-2">
        <img alt="" src={logos[project.logo]} className="size-9 shrink-0" />
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
          style={{ fontFamily: inProgress ? "Inter, sans-serif" : undefined }}
        >
          <span className={`size-2 rounded-full ${inProgress ? "bg-[#8e24aa]" : "bg-[#037847]"}`} />
          {inProgress ? "Inprogress" : "Completed"}
        </span>
      </div>
      <div className="h-px w-full bg-[#e5e7eb]" />
      <div className="flex">
        <Meta label="Duration" value={project.duration} />
        <Meta label="Deadline" value={project.deadline} />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] leading-4 text-[#6b7280]">Project Lead</span>
          <span className="mt-0 flex items-center justify-end gap-2">
            <img alt="" src={avatarPraise} className="size-4 rounded-full object-cover" />
            <span className="text-[14px] leading-6 text-[#111827]">{project.lead}</span>
          </span>
        </span>
      </div>
      <div className="w-full bg-[#fafbfb] p-2">
        <span className="flex items-center justify-between text-[10px] leading-[8px] text-black">
          <span>{project.progress}%</span>
          <span>100%</span>
        </span>
        <span className="relative mt-1 block h-[3px] w-full rounded-[30px] bg-[#03c95a]">
          <span className="absolute top-0 left-0 h-[3px] rounded-[30px] bg-[#ffc107]" style={{ width: `${project.progress}%` }} />
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center">
          {faces.map((face, index) => (
            <img
              key={face}
              alt=""
              src={face}
              className={`size-6 rounded-full border border-white object-cover ${index > 0 ? "-ml-2.5" : ""}`}
            />
          ))}
        </span>
        <span className="flex items-center gap-3 text-[12px] leading-[18px] text-[#25272d]" style={{ fontFamily: "Inter, sans-serif" }}>
          <span className="inline-flex items-center gap-1">
            {project.comments}
            <img alt="" src={commentIcon} className="size-3.5" />
          </span>
          <span className="inline-flex items-center gap-1">
            {project.subtasks}
            <img alt="" src={subtaskIcon} className="size-3.5" />
          </span>
          <span>{project.updated}</span>
        </span>
      </div>
    </button>
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

function ProjectModals({
  modal,
  onChange,
  onClose,
}: {
  modal: ProjectModal | null;
  onChange: (modal: ProjectModal) => void;
  onClose: () => void;
}) {
  const [rendered, setRendered] = useState<ProjectModal | null>(modal);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!modal) {
      setOpen(false);
      return;
    }
    setRendered(modal);
    setOpen(true);
  }, [modal]);

  useEffect(() => {
    if (modal || !rendered) return;
    const timer = window.setTimeout(() => setRendered(null), 200);
    return () => window.clearTimeout(timer);
  }, [modal, rendered]);

  useEffect(() => {
    if (!rendered || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !floatingLayerOpen()) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [rendered, open, onClose]);

  if (!rendered) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 ${open ? "palurn-overlay-in" : "palurn-overlay-out"}`}
        onMouseDown={() => {
          if (open && !floatingLayerOpen()) onClose();
        }}
      />
      <div
        key={rendered}
        className={`relative max-h-[calc(100svh-32px)] w-full overflow-y-auto ${rendered === "success" ? "max-w-[480px]" : "max-w-[600px]"} ${open ? "palurn-modal-in" : "palurn-modal-out"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {rendered === "create" ? <CreateProjectForm onClose={onClose} onSave={() => onChange("success")} /> : null}
        {rendered === "success" ? (
          <SuccessDialog
            title="Access Granted!"
            message="You have successfully onboarded a new employee as an Admin into the application."
            action="Contine"
            onClose={onClose}
          />
        ) : null}
      </div>
    </div>
  );
}

function floatingLayerOpen() {
  return Boolean(document.querySelector("[data-slot=dropdown-menu-popup]:not([data-closed]), [data-slot=popover-popup]:not([data-closed])"));
}

type DraftTask = {
  id: string;
  title: string;
  starred: boolean;
  done: boolean;
  status: "inprogress" | "completed";
};

function CreateProjectForm({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(projectStatuses[0] ?? "To Do");
  const [team, setTeam] = useState("");
  const [lead, setLead] = useState("");
  const [manager, setManager] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<DraftTask[]>(seedTasks);
  const [files, setFiles] = useState<File[]>([]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    logAction("Save project", { name, team, lead, manager, priority });
    onSave();
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setFiles((current) => [...current, ...Array.from(list)]);
  }

  return (
    <form className="rounded-[16px] bg-white pt-3 pb-8" onSubmit={save}>
      <div className="relative">
        <div className="flex h-[60px] items-center border-b border-[#ececec] px-6">
          <OptionMenu label="Status" options={projectStatuses} value={status} onSelect={setStatus} align="start" className="flex cursor-pointer items-center gap-2.5">
            <span className="flex h-[26px] min-w-[82px] items-center justify-center gap-1 rounded-[5px] bg-[#f8f9fa] px-1">
              <img alt="" src={blinkIcon} className="size-[9px]" />
              <span className="text-[14px] leading-4 font-medium text-[#6b7280]">{status}</span>
            </span>
            <img alt="" src={chevronIcon} className="size-3" />
          </OptionMenu>
        </div>
        <div className="px-6 py-5">
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project Name"
            className="w-full bg-transparent font-[Inter,sans-serif] text-[18px] leading-7 font-semibold text-[#35383d] outline-none placeholder:text-[#8f929c]"
          />
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-1.5 right-[18px] cursor-pointer rounded-[8px] p-2.5">
          <img alt="" src={closeIcon} className="size-6" />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2.5">
            <span className="text-[14px] leading-6 text-[#1e293b]">Team</span>
            <input name="team" value={team} onChange={(event) => setTeam(event.target.value)} placeholder="Add team members" className={fieldClass} />
          </label>
          <SelectField label="Team Lead" name="lead" placeholder="Select lead" options={projectLeads} value={lead} onSelect={setLead} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2.5">
            <span className="text-[14px] leading-6 text-[#1e293b]">Project Manager</span>
            <input name="manager" value={manager} onChange={(event) => setManager(event.target.value)} placeholder="Select project manager" className={fieldClass} />
          </label>
          <SelectField label="Priority" name="priority" placeholder="Select priority level" options={projectPriorities} value={priority} onSelect={setPriority} />
        </div>
        <DateRangeFields startName="start" endName="end" defaultRange={{ from: new Date(2026, 1, 5), to: new Date(2026, 3, 5) }} />
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[23px] tracking-[0.3px] text-[#1e293b]">Description</span>
          <span className="flex h-[100px] flex-col rounded-[8px] border border-[#f2f3f5] bg-white p-4">
            <textarea
              name="description"
              value={description}
              maxLength={200}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add your description..."
              className="min-h-0 w-full flex-1 resize-none bg-transparent text-[14px] leading-6 text-[#35383d] outline-none placeholder:text-[#4b5563]"
            />
            <span className="text-right text-[12px] leading-6 text-[#4b5563]">{description.length}/200</span>
          </span>
        </label>

        <section className="overflow-hidden rounded-[5px] border border-[#e5e7eb] bg-white">
          <header className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
            <h3 className="text-[16px] leading-6 font-semibold text-[#111827]">Tasks</h3>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-[5px] bg-[#f04e1a] p-2 text-[10px] leading-[8px] font-medium text-white"
              onClick={() => {
                setTasks((current) => [...current, { id: `task-${Date.now()}`, title: "New task", starred: false, done: false, status: "inprogress" }]);
                logAction("Add project task");
              }}
            >
              <img alt="" src={addPlus} className="size-2" />
              Add New
            </button>
          </header>
          <div className="flex flex-col gap-2 p-5">
            {tasks.map((task) => (
              <DraftTaskRow
                key={task.id}
                task={task}
                onToggle={() =>
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === task.id ? { ...item, done: !item.done, status: item.done ? "inprogress" : "completed" } : item,
                    ),
                  )
                }
                onStar={() => setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, starred: !item.starred } : item)))}
                onDelete={() => setTasks((current) => current.filter((item) => item.id !== task.id))}
              />
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[5px] border border-[#e5e7eb] bg-white">
          <header className="border-b border-[#e5e7eb] px-5 py-4">
            <h3 className="text-[16px] leading-6 font-semibold text-[#111827]">Files</h3>
          </header>
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col items-center gap-3 border border-dashed border-[#d0d5dd] bg-white px-6 py-4"
            onClick={() => fileInput.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
          >
            <span className="flex size-10 items-center justify-center rounded-[8px] border border-[#eaecf0] shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              <img alt="" src={uploadIcon} className="size-5" />
            </span>
            <span className="flex flex-col items-center gap-1">
              <span className="text-[14px] leading-5">
                <span className="font-[Inter,sans-serif] font-semibold text-[#009ddc]">Click to upload</span>
                <span className="font-[Inter,sans-serif] font-normal text-[#475467]"> or drag and drop</span>
              </span>
              <span className="font-[Inter,sans-serif] text-[12px] leading-[18px] text-[#475467]">SVG, PNG, JPG or GIF (max. 800x400px)</span>
            </span>
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/svg+xml,image/png,image/jpeg,image/gif"
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          {files.length ? (
            <ul className="flex flex-col gap-1 px-5 py-3">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`} className="truncate text-[13px] leading-5 text-[#475467]">
                  {file.name}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <div className="flex justify-end gap-3 py-3">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-[5px] bg-[#f6f8fa] px-4 py-[7px] text-[14px] leading-6 font-medium text-[#373b47]">
            Cancel
          </button>
          <button type="submit" className="cursor-pointer rounded-[5px] bg-[#f04e1a] px-4 py-[7px] text-[14px] leading-6 font-medium text-white">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function SelectField({
  label,
  name,
  placeholder,
  options,
  value,
  onSelect,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-[14px] leading-6 text-[#1e293b]">{label}</span>
      <OptionMenu
        name={name}
        value={value}
        label={label}
        options={options}
        onSelect={onSelect}
        align="start"
        itemClassName="text-[14px] leading-6"
        className={`${fieldClass} relative flex cursor-pointer items-center pr-10 text-left ${value ? "text-[#35383d]" : "text-[#6b6b6b]"}`}
      >
        <span className="min-w-0 flex-1 truncate">{value || placeholder}</span>
        <img alt="" src={chevronIcon} className="pointer-events-none absolute top-1/2 right-5 size-3 -translate-y-1/2" />
      </OptionMenu>
    </label>
  );
}

function DraftTaskRow({
  task,
  onToggle,
  onStar,
  onDelete,
}: {
  task: DraftTask;
  onToggle: () => void;
  onStar: () => void;
  onDelete: () => void;
}) {
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
      <span
        className={
          inProgress
            ? "inline-flex shrink-0 items-center gap-1.5 rounded-[16px] bg-[rgba(142,36,170,0.05)] py-0.5 pr-2 pl-1.5 font-[Inter,sans-serif] text-[10px] leading-[18px] text-[#8e24aa]"
            : "inline-flex shrink-0 items-center gap-1.5 rounded-[16px] bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[10px] leading-[18px] text-[#037847]"
        }
      >
        <span className={`size-2 rounded-full ${inProgress ? "bg-[#8e24aa]" : "bg-[#037847]"}`} />
        {inProgress ? "Inprogress" : "Completed"}
      </span>
      <span className="flex shrink-0 items-center">
        {faces.map((face, index) => (
          <img key={face} alt="" src={face} className={`size-6 rounded-full border border-white object-cover ${index > 0 ? "-ml-2.5" : ""}`} />
        ))}
      </span>
      <OptionMenu label={`More actions for ${task.title}`} options={["Delete"]} value="" onSelect={onDelete} align="end" className="cursor-pointer rounded p-0.5">
        <img alt="" src={taskDots} className="size-3.5" />
      </OptionMenu>
    </div>
  );
}
