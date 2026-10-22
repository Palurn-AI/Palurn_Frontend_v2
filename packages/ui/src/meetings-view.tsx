import { logAction } from "./log-action.ts";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { MeetingRecord, MeetingsResponse } from "@palurn/api";

import checkIcon from "./assets/meetings/check.svg";
import chevronDownIcon from "./assets/meetings/chevron-down.svg";
import chevronLeftIcon from "./assets/meetings/chevron-left.svg";
import chevronRightIcon from "./assets/meetings/chevron-right.svg";
import dotDoneIcon from "./assets/meetings/dot-done.svg";
import dotUpcomingIcon from "./assets/meetings/dot-upcoming.svg";
import dotsIcon from "./assets/meetings/dots.svg";
import emptyListArt from "./assets/meetings/empty-list.png";
import exportIcon from "./assets/meetings/export.svg";
import filterIcon from "./assets/meetings/filter.svg";
import meetIcon from "./assets/meetings/meet.svg";
import minusIcon from "./assets/meetings/minus.svg";
import moreIcon from "./assets/meetings/more.svg";
import recordIcon from "./assets/meetings/record.svg";
import sortIcon from "./assets/meetings/sort.svg";
import trashIcon from "./assets/meetings/trash.svg";

const columns =
  "grid-cols-[66px_minmax(220px,2.22fr)_minmax(150px,1fr)_140px_minmax(110px,0.75fr)_minmax(130px,0.75fr)_72px]";

export function MeetingsView({ data }: { data: MeetingsResponse }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState(data.meetings);
  const [page, setPage] = useState(data.page);
  const selectedCount = rows.filter((row) => row.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function toggleAll() {
    const selected = !allSelected;
    setRows((current) => current.map((row) => ({ ...row, selected })));
    logAction(selected ? "Select all meetings" : "Clear meeting selection", rows.length);
  }

  function toggleRow(row: MeetingRecord) {
    const selected = !row.selected;
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, selected } : item)));
    logAction(selected ? "Select meeting" : "Unselect meeting", row.title);
  }

  function goToPage(next: number) {
    const pageNumber = Math.min(data.lastPage, Math.max(1, next));
    setPage(pageNumber);
    logAction("Change meetings page", pageNumber);
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center justify-center gap-[10px] rounded-[4px] bg-[#ff541f] px-4 text-[14px] leading-normal font-normal text-white hover:bg-[#f04c16]"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={() => logAction("Record meeting")}
        >
          <img alt="" src={recordIcon} className="size-4" />
          {data.recordLabel}
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
              <ToolbarButton icon={filterIcon} label="Filters" onClick={() => logAction("Open meeting filters")} />
              <button
                type="button"
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded px-2 text-[14px] leading-[22px] font-medium text-[#111827] hover:bg-[#f9fafb]"
                style={{ fontFamily: "Inter, sans-serif" }}
                onClick={() => logAction("Sort meetings")}
              >
                <img alt="" src={sortIcon} className="size-4" />
                Sort
              </button>
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-[5px] px-2 py-0.5 text-[14px] leading-6 text-[#111827] hover:bg-[#f9fafb]"
              onClick={() => logAction("Export meetings")}
            >
              <img alt="" src={exportIcon} className="size-3.5" />
              Export
              <img alt="" src={chevronDownIcon} className="size-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
        <div className={`grid min-w-[920px] ${columns}`}>
          <div className="flex h-[54px] items-center justify-center border-b border-[#eaecf0] bg-[#fcfcfd]">
            <Checkbox checked={allSelected} indeterminate={someSelected} label="Select all meetings" onClick={toggleAll} />
          </div>
          <HeaderCell>Title</HeaderCell>
          <HeaderCell>Source</HeaderCell>
          <HeaderCell>Owner</HeaderCell>
          <HeaderCell>Status</HeaderCell>
          <HeaderCell>Date</HeaderCell>
          <div className="h-[54px] border-b border-[#eaecf0] bg-[#fcfcfd]" />

          {rows.map((row) => (
            <MeetingRow
              key={row.id}
              row={row}
              onToggle={() => toggleRow(row)}
              onOpen={() => navigate(`/meetings/${row.id}`)}
            />
          ))}
        </div>
        </div>
        {rows.length === 0 ? (
          <div className="flex min-h-[560px] items-center justify-center px-6 py-16">
            <img alt="" src={emptyListArt} className="h-[220px] w-[296px] object-contain" />
          </div>
        ) : null}
      </section>

      <div className="mt-2 flex min-h-[60px] flex-wrap items-center gap-2 rounded-b-[5px] bg-white px-4 py-2 sm:px-5">
        <p className="min-w-0 flex-1 text-[14px] leading-6 text-[#6b7280]">{data.summary}</p>
        <div className="flex items-center gap-[15px]">
          <button
            type="button"
            aria-label="Previous page"
            className="cursor-pointer"
            onClick={() => goToPage(page - 1)}
          >
            <img alt="" src={chevronLeftIcon} className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            {data.pages.map((pageNumber) => (
              <PageButton key={pageNumber} page={pageNumber} active={pageNumber === page} onSelect={goToPage} />
            ))}
            <img alt="" src={dotsIcon} className="size-3.5" />
            <PageButton page={data.lastPage} active={data.lastPage === page} onSelect={goToPage} />
          </div>
          <button
            type="button"
            aria-label="Next page"
            className="cursor-pointer"
            onClick={() => goToPage(page + 1)}
          >
            <img alt="" src={chevronRightIcon} className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function removeSelected(rows: MeetingRecord[], setRows: (rows: MeetingRecord[]) => void) {
  const selected = rows.filter((row) => row.selected).map((row) => row.title);
  setRows(rows.filter((row) => !row.selected));
  logAction("Delete meetings", selected);
}

function HeaderCell({ children }: { children: string }) {
  return (
    <div className="flex h-[54px] items-center border-b border-[#eaecf0] bg-[#fcfcfd] px-6">
      <span className="text-[14px] leading-[18px] font-medium text-black">{children}</span>
    </div>
  );
}

function MeetingRow({ row, onToggle, onOpen }: { row: MeetingRecord; onToggle: () => void; onOpen: () => void }) {
  return (
    <div className={`col-span-full grid ${columns} cursor-pointer hover:bg-[#f9fafb]`} onClick={onOpen}>
      <div
        className="flex h-[54px] items-center justify-center border-b border-[#eaecf0]"
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox checked={row.selected} label={`Select ${row.title}`} onClick={onToggle} />
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span
          className={
            row.emphasis
              ? "text-[14px] leading-5 font-medium text-[#101828]"
              : "text-[16px] leading-5 font-normal text-[#101828]"
          }
          style={row.emphasis ? { fontFamily: "Inter, sans-serif" } : undefined}
        >
          {row.title}
        </span>
      </div>
      <div className="flex h-[54px] items-center gap-1 border-b border-[#eaecf0] px-6">
        <img alt="" src={meetIcon} className="size-4" />
        <span className="text-[14px] leading-5 text-[#111827]" style={{ fontFamily: "Inter, sans-serif" }}>
          {row.source}
        </span>
      </div>
      <div className="flex h-[54px] items-center gap-1.5 border-b border-[#eaecf0] px-6">
        <span className="flex size-[26px] items-center justify-center rounded-full bg-[rgba(138,14,84,0.05)] text-[12px] leading-4 font-medium text-[#8a0e54]">
          {row.ownerInitials}
        </span>
        <span className="text-[14px] leading-5 text-[#111827]" style={{ fontFamily: "Inter, sans-serif" }}>
          {row.ownerName}
        </span>
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <StatusBadge status={row.status} />
      </div>
      <div className="flex h-[54px] items-center border-b border-[#eaecf0] px-6">
        <span className="text-[14px] leading-5 text-[#35383d]" style={{ fontFamily: "Inter, sans-serif" }}>
          {row.date}
        </span>
      </div>
      <div
        className="flex h-[54px] items-center justify-center border-b border-[#eaecf0]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={`More actions for ${row.title}`}
          className="cursor-pointer rounded p-1 hover:bg-[#f2f4f7]"
          onClick={() => logAction("Open meeting menu", row.title)}
        >
          <img alt="" src={moreIcon} className="size-4" />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: MeetingRecord["status"] }) {
  const upcoming = status === "upcoming";

  return (
    <span
      className={
        upcoming
          ? "inline-flex items-center gap-1.5 rounded-[16px] bg-[rgba(142,36,170,0.05)] py-0.5 pr-2 pl-1.5 text-[12px] leading-[18px] font-medium text-[#8e24aa]"
          : "inline-flex items-center gap-1.5 rounded-[16px] bg-[#ecfdf3] py-0.5 pr-2 pl-1.5 text-[12px] leading-[18px] font-normal text-[#037847]"
      }
      style={upcoming ? { fontFamily: "Inter, sans-serif" } : undefined}
    >
      <img alt="" src={upcoming ? dotUpcomingIcon : dotDoneIcon} className="size-2" />
      {upcoming ? "Upcoming" : "Done"}
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
