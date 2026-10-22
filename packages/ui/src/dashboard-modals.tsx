import { type FormEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "./components/calendar.tsx";
import { notifySuccess } from "./log-action.ts";
import { OptionMenu } from "./components/dropdown-menu.tsx";
import { Popover, PopoverContent, PopoverPrimitive, PopoverTrigger } from "./components/popover.tsx";

import blinkIcon from "./assets/dashboard/modal-blink.svg";
import calendarIcon from "./assets/dashboard/modal-calendar.svg";
import checkIcon from "./assets/dashboard/modal-check.svg";
import chevronLgIcon from "./assets/dashboard/modal-chevron-lg.svg";
import chevronIcon from "./assets/dashboard/modal-chevron.svg";
import closeIcon from "./assets/dashboard/modal-close.svg";

export type DashboardModal = "member" | "member-success" | "task" | "task-success";

const teams = ["Design", "Engineering", "Marketing", "Operations"];
const genders = ["Female", "Male", "Other"];
const assignees = ["Praise Nna.", "Andrea", "Karen"];
const projects = ["Office Management App", "Clinic Management", "Educational Platform"];
const priorities = ["High", "Medium", "Low"];
const statuses = ["To Do", "In Progress", "Review"];
const defaultDob = new Date(2026, 1, 5);
const dobStart = new Date(new Date().getFullYear() - 100, 0, 1);
const dobEnd = new Date(new Date().getFullYear() + 20, 11, 1);

const fieldClass =
  "h-[46px] w-full rounded-[5px] border border-[#f2f3f5] bg-[#fdfdfd] px-5 text-[14px] leading-6 text-[#35383d] outline-none placeholder:text-[#6b6b6b] focus:border-[#009ddc]";

export function DashboardModals({
  modal,
  onChange,
  onClose,
}: {
  modal: DashboardModal | null;
  onChange: (modal: DashboardModal) => void;
  onClose: () => void;
}) {
  const [rendered, setRendered] = useState<DashboardModal | null>(modal);
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
        className={`relative max-h-[calc(100svh-32px)] w-full overflow-y-auto ${rendered.endsWith("success") ? "max-w-[480px]" : "max-w-[600px]"} ${open ? "palurn-modal-in" : "palurn-modal-out"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {rendered === "member" ? <MemberForm onClose={onClose} onSave={() => onChange("member-success")} /> : null}
        {rendered === "member-success" ? (
          <SuccessDialog
            message="You have successfully onboarded a new employee as an Admin into the application."
            onClose={onClose}
          />
        ) : null}
        {rendered === "task" ? <TaskForm onClose={onClose} onSave={() => onChange("task-success")} /> : null}
        {rendered === "task-success" ? (
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

export function MemberForm({
  onClose,
  onSave,
  title = "Add Team Member",
}: {
  onClose: () => void;
  onSave: () => void;
  title?: string;
}) {
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notifySuccess("Team member added");
    onSave();
  }

  return (
    <form className="rounded-[16px] bg-white pt-3 pb-8" onSubmit={save}>
      <ModalHeader title={title} onClose={onClose} />
      <div className="flex flex-col gap-4 px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="First Name" name="firstName" placeholder="Enter first name" />
          <TextField label="Last Name" name="lastName" placeholder="Enter last name" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Email Address" name="email" type="email" placeholder="Enter email address" />
          <TextField label="Phone Number" name="phone" type="tel" placeholder="Enter phone number" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Team" name="team" placeholder="Select team" options={teams} />
          <TextField label="Role" name="role" placeholder="Enter role" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateField label="Date of Birth" name="dob" defaultDate={defaultDob} />
          <SelectField label="Gender" name="gender" placeholder="Select gender" options={genders} />
        </div>
        <FormActions onClose={onClose} />
      </div>
    </form>
  );
}

function TaskForm({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(statuses[0] ?? "To Do");
  const [description, setDescription] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notifySuccess("Task created");
    onSave();
  }

  return (
    <form className="rounded-[16px] bg-white pt-3 pb-8" onSubmit={save}>
      <div className="relative">
        <div className="flex h-[60px] items-center border-b border-[#ececec] px-6">
          <div>
            <OptionMenu
              label="Status"
              options={statuses}
              value={status}
              onSelect={setStatus}
              align="start"
              className="flex h-[26px] cursor-pointer items-center gap-1 rounded-[5px] bg-[#f8f9fa] px-1"
            >
              <img alt="" src={blinkIcon} className="size-[9px]" />
              <span className="text-[14px] leading-4 font-medium text-[#6b7280]">{status}</span>
              <img alt="" src={chevronIcon} className="size-3" />
            </OptionMenu>
          </div>
        </div>
        <div className="px-6 py-6">
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task Title"
            className="w-full bg-transparent text-[18px] leading-7 font-semibold text-[#35383d] outline-none placeholder:text-[#6b7280]"
          />
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="flex flex-col gap-4 px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Assignee" name="assignee" placeholder="Enter last name" />
          <SelectField label="Assign to" name="assignTo" placeholder="Select" options={assignees} />
        </div>
        <DateRangeFields
          startName="start"
          endName="end"
          defaultRange={{ from: new Date(2026, 1, 5), to: new Date(2026, 3, 5) }}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Project" name="project" placeholder="Select project" options={projects} />
          <SelectField label="Priority" name="priority" placeholder="Select priority level" options={priorities} />
        </div>
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
        <FormActions onClose={onClose} />
      </div>
    </form>
  );
}

export function SuccessDialog({
  title = "Success!",
  message,
  action = "Continue",
  onClose,
}: {
  title?: string;
  message: string;
  action?: string;
  onClose: () => void;
}) {
  const titleId = useId();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="w-full rounded-[12px] bg-white shadow-[0_1px_10px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)]"
    >
      <div className="flex flex-col items-center gap-4 px-10 pt-8 pb-6 text-center">
        <img alt="" src={checkIcon} className="size-12" />
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="font-[Inter,sans-serif] text-[20px] leading-7 font-bold text-[#232325]">
            {title}
          </h2>
          <p className="font-[Inter,sans-serif] text-[16px] leading-6 text-[#6f727a]">{message}</p>
        </div>
      </div>
      <div className="px-10 pt-4 pb-6">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#f04e1a] text-[16px] leading-6 font-medium text-white"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  const titleId = useId();
  return (
    <div className="relative">
      <div className="flex h-[60px] items-center border-b border-[#ececec] pr-14 pl-6">
        <h2 id={titleId} className="font-[Inter,sans-serif] text-[18px] leading-7 font-semibold text-[#35383d]">
          {title}
        </h2>
      </div>
      <CloseButton onClose={onClose} />
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" aria-label="Close" onClick={onClose} className="absolute top-1.5 right-[18px] cursor-pointer rounded-[8px] p-2.5">
      <img alt="" src={closeIcon} className="size-6" />
    </button>
  );
}

function FormActions({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-end gap-3 pt-3">
      <button type="button" onClick={onClose} className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]">
        Cancel
      </button>
      <button type="submit" className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f04e1a] text-[14px] leading-6 font-medium text-white">
        Save
      </button>
    </div>
  );
}

function TextField({ label, name, placeholder, type = "text" }: { label: string; name: string; placeholder: string; type?: string }) {
  return (
    <Field label={label} name={name}>
      <input id={name} name={name} type={type} placeholder={placeholder} className={fieldClass} />
    </Field>
  );
}

function SelectField({ label, name, placeholder, options }: { label: string; name: string; placeholder: string; options: string[] }) {
  const [value, setValue] = useState("");
  return (
    <Field label={label} name={name}>
      <OptionMenu
        name={name}
        value={value}
        options={options}
        onSelect={setValue}
        align="start"
        itemClassName="text-[14px] leading-6"
        className={`${fieldClass} relative flex cursor-pointer items-center pr-10 text-left ${value ? "text-[#35383d]" : "text-[#6b6b6b]"}`}
      >
        <span className="min-w-0 flex-1 truncate">{value || placeholder}</span>
        <img alt="" src={chevronIcon} className="pointer-events-none absolute top-1/2 right-5 size-3 -translate-y-1/2" />
      </OptionMenu>
    </Field>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
    .format(date)
    .replace("Apr ", "April ");
}

function isoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function floatingLayerOpen() {
  return Boolean(document.querySelector("[data-slot=dropdown-menu-popup]:not([data-closed]), [data-slot=popover-popup]:not([data-closed])"));
}

function keepsDatePopoverOpen(event: Event) {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("[data-slot=dropdown-menu-popup], [data-slot=dropdown-menu-trigger]")) return true;
  if (event instanceof FocusEvent && event.relatedTarget instanceof Element) {
    return Boolean(event.relatedTarget.closest("[data-slot=dropdown-menu-popup], [data-slot=dropdown-menu-trigger]"));
  }
  return Boolean(document.querySelector("[data-slot=dropdown-menu-popup]:not([data-closed])"));
}

export function DateRangeFields({
  startName,
  endName,
  defaultRange,
}: {
  startName: string;
  endName: string;
  defaultRange: DateRange;
}) {
  const handle = useMemo(() => PopoverPrimitive.createHandle(), []);
  const rowRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<DateRange | undefined>(defaultRange);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover
        handle={handle}
        open={open}
        onOpenChange={(next, details) => {
          if (!next && keepsDatePopoverOpen(details.event)) {
            details.cancel();
            return;
          }
          setOpen(next);
        }}
      >
        <PopoverContent anchor={rowRef} className="w-(--anchor-width) p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            captionLayout="dropdown"
            reverseYears
            startMonth={dobStart}
            endMonth={dobEnd}
            className="w-full"
            classNames={{ root: "w-full", months: "w-full flex-row", month: "w-auto min-w-0 flex-1" }}
            defaultMonth={range?.from}
            selected={range}
            onSelect={(selected) => {
              setRange(selected);
              if (selected?.from && selected.to) setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <div ref={rowRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DateTrigger handle={handle} id={startName} name={startName} label="Start Date" date={range?.from} />
        <DateTrigger handle={handle} id={endName} name={endName} label="End Date" date={range?.to} />
      </div>
    </>
  );
}

function DateTrigger({
  handle,
  id,
  name,
  label,
  date,
}: {
  handle: ReturnType<typeof PopoverPrimitive.createHandle>;
  id: string;
  name: string;
  label: string;
  date: Date | undefined;
}) {
  return (
    <Field label={label} name={id}>
      <input type="hidden" name={name} value={date ? isoDate(date) : ""} />
      <PopoverTrigger
        handle={handle}
        id={id}
        type="button"
        className={`${fieldClass} relative flex cursor-pointer items-center pr-10 pl-11 text-left aria-expanded:border-[#009ddc]`}
      >
        <img alt="" src={calendarIcon} className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2" />
        <span className="min-w-0 flex-1 truncate">{date ? formatDate(date) : "Select date"}</span>
        <img alt="" src={chevronLgIcon} className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2" />
      </PopoverTrigger>
    </Field>
  );
}

function DateField({ label, name, defaultDate }: { label: string; name: string; defaultDate: Date }) {
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [open, setOpen] = useState(false);

  return (
    <Field label={label} name={name}>
      <input type="hidden" name={name} value={date ? isoDate(date) : ""} />
      <Popover
        open={open}
        onOpenChange={(next, details) => {
          if (!next && keepsDatePopoverOpen(details.event)) {
            details.cancel();
            return;
          }
          setOpen(next);
        }}
      >
        <PopoverTrigger
          id={name}
          type="button"
          className={`${fieldClass} relative flex w-full cursor-pointer items-center pr-10 pl-11 text-left aria-expanded:border-[#009ddc]`}
        >
          <img alt="" src={calendarIcon} className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2" />
          <span className="min-w-0 flex-1 truncate">{date ? formatDate(date) : "Select date"}</span>
          <img alt="" src={chevronLgIcon} className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2" />
        </PopoverTrigger>
        <PopoverContent className="w-(--anchor-width) p-0">
          <Calendar
            mode="single"
            required
            captionLayout="dropdown"
            reverseYears
            startMonth={dobStart}
            endMonth={dobEnd}
            className="w-full"
            classNames={{ root: "w-full", months: "w-full", month: "w-full" }}
            defaultMonth={date}
            selected={date}
            onSelect={(selected) => {
              setDate(selected);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

function Field({ label, name, children }: { label: string; name: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-2.5" htmlFor={name}>
      <span className="text-[14px] leading-6 text-[#1e293b]">{label}</span>
      {children}
    </label>
  );
}
