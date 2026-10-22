import { logAction } from "./log-action.ts";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { TaskPerson, TaskPriority, TaskRecord, TaskTag, TasksResponse, TaskWorkflowStatus } from "@palurn/api";

import { DashboardModals, type DashboardModal } from "./dashboard-modals.tsx";

import avatarLeona from "./assets/meetings/avatar-leona.png";
import avatarLewis from "./assets/meetings/avatar-lewis.png";
import avatarMoseley from "./assets/meetings/avatar-moseley.png";
import avatarPineiro from "./assets/meetings/avatar-pineiro.png";
import checkIcon from "./assets/meetings/check.svg";
import chevronDownIcon from "./assets/meetings/chevron-down.svg";
import chevronLeftIcon from "./assets/meetings/chevron-left.svg";
import chevronRightIcon from "./assets/meetings/chevron-right.svg";
import dotsIcon from "./assets/meetings/dots.svg";
import exportIcon from "./assets/meetings/export.svg";
import filterIcon from "./assets/meetings/filter.svg";
import minusIcon from "./assets/meetings/minus.svg";
import moreIcon from "./assets/meetings/more.svg";
import sortIcon from "./assets/meetings/sort.svg";
import trashIcon from "./assets/meetings/trash.svg";
import plusIcon from "./assets/tasks/plus.svg";
import statusChevron from "./assets/tasks/chevron.svg";
import dotDone from "./assets/tasks/dot-done.svg";
import dotProgress from "./assets/tasks/dot-progress.svg";
import dotReview from "./assets/tasks/dot-review.svg";
import dotTodo from "./assets/tasks/dot-todo.svg";

const avatars = {
  lewis: avatarLewis,
  leona: avatarLeona,
  pineiro: avatarPineiro,
  moseley: avatarMoseley,
} as const;

const columns =
  "grid-cols-[66px_minmax(180px,2.12fr)_minmax(120px,1.22fr)_minmax(100px,1.22fr)_minmax(100px,1.22fr)_minmax(120px,1.22fr)_minmax(96px,1fr)_minmax(96px,1fr)_60px]";

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

export function TasksView({ data }: { data: TasksResponse }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState(data.tasks);
  const [page, setPage] = useState(data.page);
  const [modal, setModal] = useState<DashboardModal | null>(null);
  const selectedCount = rows.filter((row) => row.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function toggleAll() {
    const selected = !allSelected;
    setRows((current) => current.map((row) => ({ ...row, selected })));
    logAction(selected ? "Select all tasks" : "Clear task selection", rows.length);
  }

  function toggleRow(row: TaskRecord) {
    const selected = !row.selected;
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, selected } : item)));
    logAction(selected ? "Select task" : "Unselect task", row.title);
  }

  function goToPage(next: number) {
    const pageNumber = Math.min(data.lastPage, Math.max(1, next));
    setPage(pageNumber);
    logAction("Change tasks page", pageNumber);
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center justify-center gap-[10px] rounded-[4px] bg-[#ff541f] px-4 text-[14px] leading-normal font-normal text-white hover:bg-[#f04c16]"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={() => {
            setModal("task");
            logAction("Open create task");
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
              <ToolbarButton icon={trashIcon} label="Delete" onClick={() => removeSelected(rows, setRows)} />
              <ToolbarButton icon={filterIcon} label="Filters" onClick={() => logAction("Open task filters")} />
              <button
                type="button"
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded px-2 text-[14px] leading-[22px] font-medium text-[#111827] hover:bg-[#f9fafb]"
                style={{ fontFamily: "Inter, sans-serif" }}
                onClick={() => logAction("Sort tasks")}
              >
                <img alt="" src={sortIcon} className="size-4" />
                Sort
              </button>
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-[5px] px-2 py-0.5 text-[14px] leading-6 text-[#111827] hover:bg-[#f9fafb]"
              onClick={() => logAction("Export tasks")}
            >
              <img alt="" src={exportIcon} className="size-3.5" />
              Export
              <img alt="" src={chevronDownIcon} className="size-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
        <div className={`grid min-w-[980px] ${columns}`}>
          <div className="flex h-[54px] items-center justify-center border-b border-[#eaecf0] bg-[#fcfcfd]">
            <Checkbox checked={allSelected} indeterminate={someSelected} label="Select all tasks" onClick={toggleAll} />
          </div>
          <HeaderCell>Title</HeaderCell>
          <HeaderCell>Assignee</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell className="px-3">Priority</HeaderCell>
          <HeaderCell className="px-3">Status</HeaderCell>
          <HeaderCell className="px-2.5">Due date</HeaderCell>
          <HeaderCell className="px-2.5">Tag</HeaderCell>
          <div className="h-[54px] border-b border-[#eaecf0] bg-[#fcfcfd]" />

          {rows.map((row) => (
            <TaskRow
              key={row.id}
              row={row}
              onToggle={() => toggleRow(row)}
              onOpen={() => navigate(`/tasks/${row.id}`)}
            />
          ))}
        </div>
        </div>
        {rows.length === 0 ? <p className="px-6 py-8 text-[14px] leading-5 text-[#6b7280]">No tasks yet.</p> : null}
      </section>

      <div className="mt-2 flex min-h-[60px] flex-wrap items-center gap-2 rounded-b-[5px] bg-white px-4 py-2 sm:px-5">
        <p className="min-w-0 flex-1 text-[14px] leading-6 text-[#6b7280]">{data.summary}</p>
        <div className="flex items-center gap-[15px]">
          <button type="button" aria-label="Previous page" className="cursor-pointer" onClick={() => goToPage(page - 1)}>
            <img alt="" src={chevronLeftIcon} className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            {data.pages.map((pageNumber) => (
              <PageButton key={pageNumber} page={pageNumber} active={pageNumber === page} onSelect={goToPage} />
            ))}
            <img alt="" src={dotsIcon} className="size-3.5" />
            <PageButton page={data.lastPage} active={data.lastPage === page} onSelect={goToPage} />
          </div>
          <button type="button" aria-label="Next page" className="cursor-pointer" onClick={() => goToPage(page + 1)}>
            <img alt="" src={chevronRightIcon} className="size-4" />
          </button>
        </div>
      </div>
      <DashboardModals modal={modal} onChange={setModal} onClose={() => setModal(null)} />
    </div>
  );
}

function removeSelected(rows: TaskRecord[], setRows: (rows: TaskRecord[]) => void) {
  const selected = rows.filter((row) => row.selected).map((row) => row.title);
  setRows(rows.filter((row) => !row.selected));
  logAction("Delete tasks", selected);
}

function HeaderCell({ children, className = "px-6" }: { children: string; className?: string }) {
  return (
    <div className={`flex h-[54px] items-center border-b border-[#eaecf0] bg-[#fcfcfd] ${className}`}>
      <span className="text-[14px] leading-[18px] font-medium text-black">{children}</span>
    </div>
  );
}

function TaskRow({ row, onToggle, onOpen }: { row: TaskRecord; onToggle: () => void; onOpen: () => void }) {
  return (
    <div className={`col-span-full grid ${columns} cursor-pointer hover:bg-[#f9fafb]`} onClick={onOpen}>
      <div className="flex h-[54px] items-center justify-center border-b border-[#eaecf0]" onClick={(event) => event.stopPropagation()}>
        <Checkbox checked={row.selected} label={`Select ${row.title}`} onClick={onToggle} />
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className={`truncate text-[14px] leading-5 text-[#101828] ${row.emphasis ? "font-semibold" : "font-normal"}`}>
          {row.title}
        </span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <AssigneeStack people={row.assignees} extra={row.extraAssignees} />
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className="text-[14px] leading-6 text-[#111827]" style={{ fontFamily: "Inter, sans-serif" }}>
          {kindLabel[row.kind]}
        </span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-3">
        <span className={`inline-flex h-[26px] items-center gap-[5px] rounded-[5px] px-1.5 text-[12px] leading-[8px] font-medium text-white ${priorityClass[row.priority]}`}>
          <span className="size-[5px] rounded-full bg-white" />
          {priorityLabel[row.priority]}
        </span>
      </div>
      <div
        className="flex h-[54px] items-center gap-2.5 border-b border-[#eaecf0] px-3"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={`inline-flex cursor-pointer items-center gap-1 rounded-[5px] p-1 text-[12px] leading-4 font-medium ${statusClass[row.status]}`}
          onClick={() => logAction("Open task status", row.title)}
        >
          <img alt="" src={statusDot[row.status]} className="size-[9px]" />
          {statusLabel[row.status]}
        </button>
        <img alt="" src={statusChevron} className="size-3" />
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-2.5">
        <span className="text-[14px] leading-5 whitespace-nowrap text-[#35383d]" style={{ fontFamily: "Inter, sans-serif" }}>
          {row.due}
        </span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-2.5">
        <span className={`inline-flex items-center rounded-[12px] px-3 py-1 text-[14px] leading-4 whitespace-nowrap ${tagClass[row.tag]}`}>
          {tagLabel[row.tag]}
        </span>
      </div>
      <div className="flex h-[54px] items-center justify-center border-b border-[#eaecf0]" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          aria-label={`More actions for ${row.title}`}
          className="cursor-pointer rounded p-1 hover:bg-[#f2f4f7]"
          onClick={() => logAction("Open task menu", row.title)}
        >
          <img alt="" src={moreIcon} className="size-4" />
        </button>
      </div>
    </div>
  );
}

function AssigneeStack({ people, extra }: { people: TaskPerson[]; extra: number }) {
  return (
    <span className="flex items-center">
      {people.map((person, index) => (
        <img
          key={`${person}-${index}`}
          alt=""
          src={avatars[person]}
          className={`size-6 rounded-full border border-white object-cover ${index > 0 ? "-ml-2.5" : ""}`}
        />
      ))}
      {extra > 0 ? (
        <span className="-ml-2.5 flex size-6 items-center justify-center rounded-full bg-[#ff541f] text-[10px] leading-[8px] font-medium text-white">
          +{extra}
        </span>
      ) : null}
    </span>
  );
}

function Checkbox({
  checked,
  indeterminate = false,
  label,
  onClick,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      className={
        indeterminate
          ? "flex size-5 cursor-pointer items-center justify-center rounded-[6px] border border-[#009ddc] bg-[#f7faff]"
          : checked
            ? "flex size-5 cursor-pointer items-center justify-center rounded-[6px] border border-[#009ddc] bg-[#009ddc]"
            : "flex size-5 cursor-pointer items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white"
      }
      onClick={onClick}
    >
      {indeterminate ? <img alt="" src={minusIcon} className="size-3.5" /> : null}
      {checked && !indeterminate ? <img alt="" src={checkIcon} className="size-3.5" /> : null}
    </button>
  );
}

function ToolbarButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] leading-5 font-medium text-[#344054] hover:bg-[#f9fafb]"
      style={{ fontFamily: "Inter, sans-serif" }}
      onClick={onClick}
    >
      <img alt="" src={icon} className="size-5" />
      {label}
    </button>
  );
}

function PageButton({ page, active, onSelect }: { page: number; active: boolean; onSelect: (page: number) => void }) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "flex size-6 cursor-pointer items-center justify-center rounded-[20px] bg-[#ff541f] text-[12px] leading-4 text-white"
          : "flex size-6 cursor-pointer items-center justify-center rounded-[20px] border border-[#e5e7eb] text-[12px] leading-4 text-[#6b7280]"
      }
      onClick={() => onSelect(page)}
    >
      {page}
    </button>
  );
}
