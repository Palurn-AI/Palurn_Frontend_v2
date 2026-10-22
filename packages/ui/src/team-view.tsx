import { logAction } from "./log-action.ts";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { MemberForm, SuccessDialog } from "./dashboard-modals.tsx";
import checkIcon from "./assets/meetings/check.svg";
import chevronDownIcon from "./assets/meetings/chevron-down.svg";
import chevronLeftIcon from "./assets/meetings/chevron-left.svg";
import chevronRightIcon from "./assets/meetings/chevron-right.svg";
import dotsIcon from "./assets/meetings/dots.svg";
import exportIcon from "./assets/meetings/export.svg";
import filterIcon from "./assets/meetings/filter.svg";
import minusIcon from "./assets/meetings/minus.svg";
import sortIcon from "./assets/meetings/sort.svg";
import taskDots from "./assets/meetings/task-dots.svg";
import trashIcon from "./assets/meetings/trash.svg";
import closeIcon from "./assets/dashboard/modal-close.svg";
import dennisAvatar from "./assets/team/dennis.png";
import plusOrange from "./assets/team/plus-orange.svg";
import praiseAvatar from "./assets/team/praise.png";
import plusIcon from "./assets/tasks/plus.svg";
import { deptClass, deptLabel, teamMembers, type TeamMember } from "./team-data.ts";

const columns =
  "grid-cols-[66px_minmax(180px,1.35fr)_minmax(190px,1.4fr)_150px_160px_minmax(120px,0.9fr)_minmax(140px,1fr)_44px]";

const avatars = { praise: praiseAvatar, dennis: dennisAvatar };

export type TeamModal = "add" | "invite" | "success";

export function TeamView() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(teamMembers);
  const [page, setPage] = useState(4);
  const [modal, setModal] = useState<TeamModal | null>(null);
  const selectedCount = rows.filter((row) => row.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function toggleAll() {
    const selected = !allSelected;
    setRows((current) => current.map((row) => ({ ...row, selected })));
    logAction(selected ? "Select all teammates" : "Clear teammate selection");
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">Team</h1>
        <div className="flex flex-wrap items-center gap-[15px]">
          <button
            type="button"
            className="flex h-10 cursor-pointer items-center justify-center gap-[10px] rounded-[4px] border border-[#f04e1a] bg-white px-4 text-[14px] leading-normal text-[#f04e1a]"
            style={{ fontFamily: "Inter, sans-serif" }}
            onClick={() => {
              setModal("invite");
              logAction("Open invite teammate");
            }}
          >
            <img alt="" src={plusOrange} className="size-4" />
            Invite Teammate
          </button>
          <button
            type="button"
            className="flex h-10 cursor-pointer items-center justify-center gap-[10px] rounded-[4px] bg-[#f04e1a] px-4 text-[14px] leading-normal text-white hover:bg-[#f04c16]"
            style={{ fontFamily: "Inter, sans-serif" }}
            onClick={() => {
              setModal("add");
              logAction("Open add teammate");
            }}
          >
            <img alt="" src={plusIcon} className="size-4" />
            Add Teammate
          </button>
        </div>
      </div>

      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#eaecf0] px-4 pt-5 pb-[19px] sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] leading-7 font-medium text-[#101828]">Team</h2>
              <span className="rounded-[16px] border border-[#e9eaeb] bg-[#f9f5ff] px-2 py-0.5 font-[Inter,sans-serif] text-[14px] leading-5 font-medium text-[#6941c6]">
                12 users
              </span>
            </div>
            <p className="mt-1 text-[14px] leading-5 text-[#6b7280]" style={{ fontFamily: "Lato, sans-serif" }}>
              Summary of all Team members
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <ToolbarButton
                icon={trashIcon}
                label="Delete"
                onClick={() => {
                  const removed = rows.filter((row) => row.selected).map((row) => row.name);
                  setRows((current) => current.filter((row) => !row.selected));
                  logAction("Delete teammates", removed);
                }}
              />
              <ToolbarButton icon={filterIcon} label="Filters" onClick={() => logAction("Open team filters")} />
              <button
                type="button"
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded px-2 text-[14px] leading-[22px] font-medium text-[#111827] hover:bg-[#f9fafb]"
                style={{ fontFamily: "Inter, sans-serif" }}
                onClick={() => logAction("Sort teammates")}
              >
                <img alt="" src={sortIcon} className="size-4" />
                Sort
              </button>
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-[5px] px-2 py-0.5 text-[14px] leading-6 text-[#111827] hover:bg-[#f9fafb]"
              onClick={() => logAction("Export teammates")}
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
              <Checkbox checked={allSelected} indeterminate={someSelected} label="Select all teammates" onClick={toggleAll} />
            </div>
            <Header>Name</Header>
            <Header>Email Address</Header>
            <Header>Dept</Header>
            <Header>Position</Header>
            <Header>Status</Header>
            <Header>Last updated</Header>
            <div className="h-[54px] border-b border-[#eaecf0] bg-[#fcfcfd]" />
            {rows.map((row) => (
              <MemberRow
                key={row.id}
                row={row}
                onToggle={() => setRows((current) => current.map((item) => (item.id === row.id ? { ...item, selected: !item.selected } : item)))}
                onOpen={() => navigate(`/team/${row.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mt-2 flex min-h-[60px] flex-wrap items-center gap-2 rounded-b-[5px] bg-white px-4 py-2 sm:px-5">
        <p className="min-w-0 flex-1 text-[14px] leading-6 text-[#6b7280]">Showing 1 to 10 of 16 entries</p>
        <div className="flex items-center gap-[15px]">
          <button type="button" aria-label="Previous page" className="cursor-pointer" onClick={() => setPage((current) => Math.max(1, current - 1))}>
            <img alt="" src={chevronLeftIcon} className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((pageNumber) => (
              <PageButton key={pageNumber} page={pageNumber} active={pageNumber === page} onSelect={setPage} />
            ))}
            <img alt="" src={dotsIcon} className="size-3.5" />
            <PageButton page={15} active={page === 15} onSelect={setPage} />
          </div>
          <button type="button" aria-label="Next page" className="cursor-pointer" onClick={() => setPage((current) => Math.min(15, current + 1))}>
            <img alt="" src={chevronRightIcon} className="size-4" />
          </button>
        </div>
      </div>

      <TeamModals modal={modal} onChange={setModal} onClose={() => setModal(null)} />
    </div>
  );
}

export function TeamModals({
  modal,
  onChange,
  onClose,
}: {
  modal: TeamModal | null;
  onChange: (modal: TeamModal) => void;
  onClose: () => void;
}) {
  const [rendered, setRendered] = useState<TeamModal | null>(modal);
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

  const width = rendered === "success" ? "max-w-[480px]" : rendered === "invite" ? "max-w-[640px]" : "max-w-[600px]";

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
        className={`relative max-h-[calc(100svh-32px)] w-full overflow-y-auto ${width} ${open ? "palurn-modal-in" : "palurn-modal-out"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {rendered === "add" ? <MemberForm title="Register Team Member" onClose={onClose} onSave={() => onChange("success")} /> : null}
        {rendered === "invite" ? <InviteForm onClose={onClose} onSend={() => onChange("success")} /> : null}
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

function InviteForm({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  const [email, setEmail] = useState("");

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    logAction("Send teammate invite", email);
    onSend();
  }

  return (
    <form
      className="rounded-[16px] bg-white px-6 pt-6 pb-8 shadow-[0_20px_24px_-4px_rgba(10,13,18,0.1),0_8px_8px_-4px_rgba(10,13,18,0.04)]"
      onSubmit={send}
    >
      <div className="relative">
        <h2 className="pr-10 text-[20px] leading-7 font-semibold text-[#181d27]">Invite Teammate</h2>
        <p className="mt-1 text-[16px] leading-5 text-[#535862]">Invite your team mate to collaborate and review on tasks</p>
        <button type="button" aria-label="Close" onClick={onClose} className="absolute -top-2.5 -right-2 cursor-pointer rounded-[8px] p-2.5">
          <img alt="" src={closeIcon} className="size-6" />
        </button>
      </div>
      <label className="mt-8 flex flex-col gap-1.5">
        <span className="font-[Inter,sans-serif] text-[16px] leading-5 font-medium text-[#414651]">Email an Invite</span>
        <span className="flex items-center gap-1.5">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email address"
            className="h-11 min-w-0 flex-1 rounded-[8px] border border-[#d5d7da] bg-white px-3.5 font-[Inter,sans-serif] text-[14px] leading-6 text-[#181d27] shadow-[0_1px_2px_rgba(10,13,18,0.05)] outline-none placeholder:text-[#717680] focus:border-[#009ddc]"
          />
          <button type="submit" className="h-[38px] shrink-0 cursor-pointer rounded-[5px] bg-[#f04e1a] px-4 text-[14px] leading-6 font-medium text-white">
            Send Invite
          </button>
        </span>
      </label>
    </form>
  );
}

function floatingLayerOpen() {
  return Boolean(document.querySelector("[data-slot=dropdown-menu-popup]:not([data-closed]), [data-slot=popover-popup]:not([data-closed])"));
}

function Header({ children }: { children: string }) {
  return (
    <div className="flex h-[54px] items-center border-b border-[#eaecf0] bg-[#fcfcfd] px-6">
      <span className="text-[14px] leading-[18px] font-medium text-black">{children}</span>
    </div>
  );
}

function MemberRow({ row, onToggle, onOpen }: { row: TeamMember; onToggle: () => void; onOpen: () => void }) {
  const inactive = row.status === "inactive";
  return (
    <div className={`col-span-full grid ${columns} cursor-pointer hover:bg-[#f9fafb]`} onClick={onOpen}>
      <div className="flex h-[54px] items-center justify-center border-b border-[#eaecf0]" onClick={(event) => event.stopPropagation()}>
        <Checkbox checked={row.selected} label={`Select ${row.name}`} onClick={onToggle} />
      </div>
      <div className="flex h-[54px] items-center gap-1.5 border-b border-[#eaecf0] px-6">
        <img alt="" src={avatars[row.avatar]} className="size-5 rounded-full object-cover" />
        <span className="truncate font-[Inter,sans-serif] text-[16px] leading-6 text-[#111827]">{row.name}</span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className="truncate font-[Inter,sans-serif] text-[14px] leading-5 text-[#35383d]">{row.email}</span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className={`inline-flex items-center justify-center rounded-[12px] px-3 py-1 text-[14px] leading-4 ${deptClass[row.dept]}`}>
          {deptLabel[row.dept]}
        </span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className="font-[Inter,sans-serif] text-[14px] leading-5 text-[#111827]">{row.position}</span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span
          className={
            inactive
              ? "inline-flex items-center gap-1.5 rounded-[16px] bg-[rgba(233,66,53,0.05)] py-0.5 pr-2 pl-1.5 font-[Inter,sans-serif] text-[12px] leading-[18px] font-medium text-[#e94235]"
              : "inline-flex items-center gap-1.5 rounded-[16px] bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[12px] leading-[18px] text-[#037847]"
          }
        >
          <span className={`size-2 rounded-full ${inactive ? "bg-[#e94235]" : "bg-[#037847]"}`} />
          {inactive ? "Inactive" : "Active"}
        </span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className="font-[Inter,sans-serif] text-[14px] leading-5 text-[#35383d]">{row.updated}</span>
      </div>
      <div className="flex h-[54px] items-center justify-center border-b border-[#eaecf0]" onClick={(event) => event.stopPropagation()}>
        <button type="button" aria-label={`More actions for ${row.name}`} className="cursor-pointer rounded p-0.5" onClick={() => logAction("Open teammate menu", row.name)}>
          <img alt="" src={taskDots} className="size-3.5" />
        </button>
      </div>
    </div>
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
          ? "flex size-6 cursor-pointer items-center justify-center rounded-[20px] bg-[#f04e1a] text-[12px] leading-4 text-white"
          : "flex size-6 cursor-pointer items-center justify-center rounded-[20px] border border-[#e5e7eb] text-[12px] leading-4 text-[#6b7280]"
      }
      onClick={() => onSelect(page)}
    >
      {page}
    </button>
  );
}
