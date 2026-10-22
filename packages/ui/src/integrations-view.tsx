import { logAction } from "./log-action.ts";
import { useEffect, useState } from "react";
import type { IntegrationIcon, IntegrationRecord, IntegrationsResponse } from "@palurn/api";

import { Switch } from "./components/switch.tsx";

import chevronDownIcon from "./assets/meetings/chevron-down.svg";
import chevronLeftIcon from "./assets/meetings/chevron-left.svg";
import chevronRightIcon from "./assets/meetings/chevron-right.svg";
import dotsIcon from "./assets/meetings/dots.svg";
import exportIcon from "./assets/meetings/export.svg";
import filterIcon from "./assets/meetings/filter.svg";
import sortIcon from "./assets/meetings/sort.svg";
import amazonIcon from "./assets/integrations/amazon.svg";
import calendarIcon from "./assets/integrations/calendar.png";
import cancelIcon from "./assets/integrations/cancel.svg";
import chatgptIcon from "./assets/integrations/chatgpt.svg";
import docsIcon from "./assets/integrations/docs.svg";
import driveIcon from "./assets/integrations/drive.svg";
import dropboxIcon from "./assets/integrations/dropbox.svg";
import gmailIcon from "./assets/integrations/gmail.svg";
import googleIcon from "./assets/integrations/google.svg";
import hubspotIcon from "./assets/integrations/hubspot.svg";
import metaIcon from "./assets/integrations/meta.svg";
import notionIcon from "./assets/integrations/notion.svg";
import salesforceIcon from "./assets/integrations/salesforce.svg";
import sheetsIcon from "./assets/integrations/sheets.svg";
import slackIcon from "./assets/integrations/slack.svg";
import teamsIcon from "./assets/integrations/teams.svg";
import trelloIcon from "./assets/integrations/trello.svg";

const icons: Record<IntegrationIcon, string> = {
  google: googleIcon,
  slack: slackIcon,
  drive: driveIcon,
  docs: docsIcon,
  notion: notionIcon,
  meta: metaIcon,
  teams: teamsIcon,
  gmail: gmailIcon,
  sheets: sheetsIcon,
  salesforce: salesforceIcon,
  dropbox: dropboxIcon,
  hubspot: hubspotIcon,
  amazon: amazonIcon,
  trello: trelloIcon,
  calendar: calendarIcon,
  chatgpt: chatgptIcon,
};

export function IntegrationsView({ data }: { data: IntegrationsResponse }) {
  const [items, setItems] = useState(data.integrations);
  const [page, setPage] = useState(data.page);
  const [active, setActive] = useState<IntegrationRecord | null>(null);
  const [rendered, setRendered] = useState<IntegrationRecord | null>(null);
  const [open, setOpen] = useState(false);

  function openModal(item: IntegrationRecord) {
    setActive(item);
    logAction("Open integration", item.name);
  }

  function closeModal() {
    setActive(null);
    logAction("Close integration", rendered?.name);
  }

  useEffect(() => {
    if (!active) {
      setOpen(false);
      return;
    }
    setRendered(active);
    setOpen(true);
  }, [active]);

  useEffect(() => {
    if (active || !rendered) return;
    const timer = window.setTimeout(() => setRendered(null), 200);
    return () => window.clearTimeout(timer);
  }, [active, rendered]);

  useEffect(() => {
    if (!rendered || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [rendered, open]);

  function toggle(item: IntegrationRecord) {
    if (item.connected) {
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, connected: false } : entry)));
      logAction("Disconnect integration", item.name);
      return;
    }
    openModal(item);
  }

  function connect() {
    if (!active) {
      return;
    }
    setItems((current) => current.map((entry) => (entry.id === active.id ? { ...entry, connected: true } : entry)));
    logAction("Connect integration", active.name);
    closeModal();
  }

  function goToPage(pageNumber: number) {
    const next = Math.min(data.lastPage, Math.max(1, pageNumber));
    setPage(next);
    logAction("Change integrations page", next);
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <div className="flex h-[66px] items-center">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
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
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-4 text-[14px] leading-5 font-medium text-[#344054] hover:bg-[#f9fafb]"
              style={{ fontFamily: "Inter, sans-serif" }}
              onClick={() => logAction("Open integration filters")}
            >
              <img alt="" src={filterIcon} className="size-5" />
              Filters
            </button>
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-1.5 rounded px-2 text-[14px] leading-[22px] font-medium text-[#111827] hover:bg-[#f9fafb]"
              style={{ fontFamily: "Inter, sans-serif" }}
              onClick={() => logAction("Sort integrations")}
            >
              <img alt="" src={sortIcon} className="size-4" />
              Sort
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-[5px] px-2 py-0.5 text-[14px] leading-6 text-[#111827] hover:bg-[#f9fafb]"
              onClick={() => logAction("Export integrations")}
            >
              <img alt="" src={exportIcon} className="size-3.5" />
              Export
              <img alt="" src={chevronDownIcon} className="size-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-[15px] gap-y-7 px-2.5 py-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="flex min-h-[135px] flex-col gap-[17px] border border-[#eaecf0] px-[13px] py-[15px]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-[9px]">
                  <img alt="" src={icons[item.icon]} className="size-6 shrink-0 object-contain" />
                  <h3 className="truncate text-[18px] leading-7 font-semibold text-[#101828]">{item.name}</h3>
                </div>
                <Toggle
                  on={item.connected}
                  label={`${item.connected ? "Disconnect" : "Connect"} ${item.name}`}
                  onClick={() => toggle(item)}
                />
              </div>
              <p className="text-[14px] leading-5 font-medium text-[#6b7280]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-2 flex min-h-[60px] flex-wrap items-center gap-2 rounded-b-[5px] bg-white px-4 py-2 sm:px-5">
        <p className="min-w-0 flex-1 text-[14px] leading-6 text-[#6b7280]">{data.summary}</p>
        <div className="flex items-center gap-3 sm:gap-[15px]">
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

      {rendered ? (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? "" : "pointer-events-none"}`}>
          <div
            className={`absolute inset-0 bg-black/40 ${open ? "palurn-overlay-in" : "palurn-overlay-out"}`}
            onMouseDown={() => {
              if (open) closeModal();
            }}
          />
          <div
            className={`relative w-full max-w-[600px] ${open ? "palurn-modal-in" : "palurn-modal-out"}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <ConnectModal item={rendered} data={data} onClose={closeModal} onConnect={connect} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <Switch
      checked={on}
      aria-label={label}
      onCheckedChange={onClick}
      className="cursor-pointer p-px data-[size=default]:h-[19px] data-[size=default]:w-[37px] data-checked:bg-[#f04e1a] data-unchecked:bg-[#d9d9d9] dark:data-checked:bg-[#f04e1a] dark:data-unchecked:bg-[#d9d9d9] [&_[data-slot=switch-thumb]]:size-[17px] [&_[data-slot=switch-thumb]]:bg-[#fcfcfd] [&_[data-slot=switch-thumb]]:data-checked:translate-x-[17px]! [&_[data-slot=switch-thumb]]:dark:data-checked:bg-[#fcfcfd] [&_[data-slot=switch-thumb]]:dark:data-unchecked:bg-[#fcfcfd]"
    />
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

function ConnectModal({
  item,
  data,
  onClose,
  onConnect,
}: {
  item: IntegrationRecord;
  data: IntegrationsResponse;
  onClose: () => void;
  onConnect: () => void;
}) {
  return (
    <aside role="dialog" aria-modal="true" aria-labelledby="integration-modal-title" className="rounded-[16px] bg-white pb-3">
      <div className="flex h-[72px] items-center gap-3 overflow-hidden rounded-t-[16px] border-b-[0.5px] border-[#b5b8bf] px-6 py-[11px]">
        <h2 id="integration-modal-title" className="min-w-0 flex-1 text-[18px] leading-7 font-semibold text-[#101828]">
          Integration
        </h2>
        <button type="button" aria-label="Close" className="cursor-pointer" onClick={onClose}>
          <img alt="" src={cancelIcon} className="size-6" />
        </button>
      </div>
      <div className="mx-[25px] mt-3 flex flex-col gap-[26px] px-8 py-[18px]">
        <div className="flex flex-col gap-[13px]">
          <div className="flex items-center gap-2">
            <img alt="" src={icons[item.icon]} className="size-6 object-contain" />
            <p className="text-[20px] leading-7 font-bold text-[#101828]">{item.name}</p>
          </div>
          <p className="text-[14px] leading-6 text-[#6b7280]">
            By continuing, you will be redirected to {item.name} to authorize this integration.
            <br />
            This allows Paluurn AI to securely connect to your workspace and send real-time updates.
          </p>
        </div>
        <div className="text-[14px]">
          <p className="leading-[18px] font-bold text-[#101828]">{data.enablesTitle}</p>
          <ul className="mt-3.5 list-disc space-y-0 pl-5 leading-5 text-[#6b7280]">
            {item.enables.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-3.5 leading-5 text-[#6b7280]">{data.footnote}</p>
        </div>
      </div>
      <div className="flex justify-end px-[26px]">
        <div className="flex gap-3">
          <button
            type="button"
            className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]"
            onClick={onClose}
          >
            {data.cancelLabel}
          </button>
          <button
            type="button"
            className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f04e1a] text-[14px] leading-6 font-medium text-white"
            onClick={onConnect}
          >
            {data.connectLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}
