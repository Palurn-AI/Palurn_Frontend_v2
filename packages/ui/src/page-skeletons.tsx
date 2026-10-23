import type { CSSProperties, ReactNode } from "react";

import type { SectionId } from "@palurn/api";

import { Skeleton } from "./components/skeleton.tsx";

const bone = "bg-[#eceef2]";
const listPage = "bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9";

function Loading({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div className={className} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}

function Bone({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <Skeleton className={`${bone} ${className}`} style={style} />;
}

function PageHeading({ actions = 1 }: { actions?: number }) {
  return (
    <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-3">
      <Bone className="h-7 w-36" />
      <div className="flex gap-[15px]">
        {Array.from({ length: actions }, (_, index) => (
          <Bone key={index} className="h-10 w-36 rounded-[4px]" />
        ))}
      </div>
    </div>
  );
}

function ListToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b border-[#eaecf0] px-4 pt-5 pb-[19px] sm:flex-row sm:items-center sm:px-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Bone className="h-5 w-40" />
        <Bone className="h-3.5 w-56" />
      </div>
      <div className="flex items-center gap-3">
        <Bone className="h-8 w-16" />
        <Bone className="h-8 w-16" />
        <Bone className="h-8 w-14" />
        <Bone className="h-8 w-20" />
      </div>
    </div>
  );
}

function Pager() {
  return (
    <div className="mt-2 flex min-h-[60px] items-center gap-3 rounded-b-[5px] bg-white px-5">
      <Bone className="h-4 w-48" />
      <div className="ml-auto flex items-center gap-2">
        <Bone className="size-4" />
        {Array.from({ length: 4 }, (_, index) => (
          <Bone key={index} className="size-8 rounded-[4px]" />
        ))}
        <Bone className="size-4" />
      </div>
    </div>
  );
}

type ColumnKind =
  | "check"
  | "title"
  | "text"
  | "email"
  | "icon-text"
  | "person"
  | "avatar"
  | "faces"
  | "chip"
  | "status"
  | "pill"
  | "dot-pill"
  | "date"
  | "menu"
  | "progress"
  | "code"
  | "mini";

const titleWidths = ["w-[62%]", "w-[84%]", "w-[48%]", "w-[72%]"];
const textWidths = ["w-16", "w-[88px]", "w-14", "w-20"];
const emailWidths = ["w-40", "w-[188px]", "w-36", "w-44"];
const nameWidths = ["w-16", "w-20", "w-14", "w-[72px]"];

function ColumnMark({ kind, header = false, row = 0 }: { kind: ColumnKind; header?: boolean; row?: number }) {
  if (header) {
    if (kind === "check") return <Bone className="size-5 rounded-[6px]" />;
    if (kind === "menu") return null;
    const width =
      kind === "title"
        ? "w-10"
        : kind === "email"
          ? "w-12"
          : kind === "date"
            ? "w-16"
            : kind === "code"
              ? "w-6"
              : kind === "progress"
                ? "w-12"
                : "w-16";
    return <Bone className={`h-3.5 ${width}`} />;
  }

  if (kind === "check") return <Bone className="size-5 rounded-[6px]" />;
  if (kind === "menu") {
    return (
      <span className="flex flex-col gap-0.5">
        <Bone className="size-1 rounded-full" />
        <Bone className="size-1 rounded-full" />
        <Bone className="size-1 rounded-full" />
      </span>
    );
  }
  if (kind === "title") return <Bone className={`h-4 max-w-[220px] ${titleWidths[row % titleWidths.length]}`} />;
  if (kind === "text") return <Bone className={`h-4 ${textWidths[row % textWidths.length]}`} />;
  if (kind === "email") return <Bone className={`h-4 ${emailWidths[row % emailWidths.length]}`} />;
  if (kind === "code") return <Bone className="h-4 w-10" />;
  if (kind === "date") return <Bone className="h-4 w-[88px]" />;
  if (kind === "icon-text") {
    return (
      <span className="flex items-center gap-1">
        <Bone className="size-4 rounded-[3px]" />
        <Bone className={`h-4 ${textWidths[row % textWidths.length]}`} />
      </span>
    );
  }
  if (kind === "person" || kind === "avatar") {
    return (
      <span className="flex min-w-0 items-center gap-1.5">
        <Bone className={`${kind === "avatar" ? "size-5" : "size-[26px]"} shrink-0 rounded-full`} />
        <Bone className={`h-4 ${nameWidths[row % nameWidths.length]}`} />
      </span>
    );
  }
  if (kind === "faces") {
    return (
      <span className="flex items-center">
        {Array.from({ length: 3 }, (_, index) => (
          <Bone key={index} className={`size-6 rounded-full border border-white ${index > 0 ? "-ml-2.5" : ""}`} />
        ))}
      </span>
    );
  }
  if (kind === "chip") {
    return (
      <span className="inline-flex h-[26px] w-[72px] items-center gap-[5px] rounded-[5px] bg-[#eceef2] px-1.5">
        <span className="size-[5px] shrink-0 rounded-full bg-white" />
        <Bone className="h-2.5 w-8 bg-[#e2e4e9]" />
      </span>
    );
  }
  if (kind === "status") {
    return (
      <span className="flex items-center gap-2.5">
        <span className="inline-flex h-[26px] w-[82px] items-center gap-1 rounded-[5px] bg-[#eceef2] px-1">
          <span className="size-[9px] shrink-0 rounded-full bg-white" />
          <Bone className="h-2.5 w-10 bg-[#e2e4e9]" />
        </span>
        <Bone className="size-3 rounded-[2px]" />
      </span>
    );
  }
  if (kind === "pill") return <Bone className="h-[26px] w-[76px] rounded-[12px]" />;
  if (kind === "dot-pill") {
    return (
      <span className="inline-flex h-[22px] w-[84px] items-center gap-1.5 rounded-[16px] bg-[#eceef2] pr-2 pl-1.5">
        <span className="size-2 shrink-0 rounded-full bg-white" />
        <Bone className="h-2.5 w-10 bg-[#e2e4e9]" />
      </span>
    );
  }
  if (kind === "mini") return <Bone className="h-5 w-[60px] rounded-[5px]" />;
  return (
    <span className="flex w-[86px] flex-col gap-1">
      <Bone className="h-3.5 w-10" />
      <span className="h-1 overflow-hidden rounded-[10px] bg-[#f8f9fa]">
        <Bone className="h-full rounded-[10px]" style={{ width: `${40 + (row % 4) * 15}%` }} />
      </span>
    </span>
  );
}

function DataTable({
  columns,
  kinds,
  rows,
  minWidth = "min-w-[920px]",
  tone = "list",
}: {
  columns: string;
  kinds: ColumnKind[];
  rows: number;
  minWidth?: string;
  tone?: "list" | "card";
}) {
  const card = tone === "card";
  return (
    <div className="overflow-x-auto">
      <div className={`grid ${minWidth} ${columns}`}>
        {Array.from({ length: rows + 1 }, (_, row) =>
          kinds.map((kind, column) => {
            const centered = kind === "check" || kind === "menu";
            const header = row === 0;
            return (
              <div
                key={`${row}-${column}`}
                className={`flex items-center border-b ${
                  card
                    ? `border-[#f8f9fa] ${header ? "bg-[#f8f9fa] px-5 py-1.5" : "h-14 px-5"}`
                    : `border-[#eaecf0] ${header ? "h-[54px] bg-[#fcfcfd]" : "h-[54px]"} ${centered ? "justify-center" : "px-6"}`
                } ${card && centered ? "justify-center" : ""}`}
              >
                <ColumnMark kind={kind} header={header} row={row} />
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

const meetingColumns =
  "grid-cols-[66px_minmax(220px,2.22fr)_minmax(150px,1fr)_140px_minmax(110px,0.75fr)_minmax(130px,0.75fr)_72px]";
const meetingKinds: ColumnKind[] = ["check", "title", "icon-text", "person", "dot-pill", "date", "menu"];

const taskColumns =
  "grid-cols-[66px_minmax(180px,2.12fr)_minmax(120px,1.22fr)_minmax(100px,1.22fr)_minmax(100px,1.22fr)_minmax(120px,1.22fr)_minmax(96px,1fr)_minmax(96px,1fr)_60px]";
const taskKinds: ColumnKind[] = ["check", "title", "faces", "text", "chip", "status", "date", "pill", "menu"];

const teamColumns =
  "grid-cols-[66px_minmax(180px,1.35fr)_minmax(190px,1.4fr)_150px_160px_minmax(120px,0.9fr)_minmax(140px,1fr)_44px]";
const teamKinds: ColumnKind[] = ["check", "avatar", "email", "pill", "text", "dot-pill", "date", "menu"];

const dashboardTaskColumns = "grid-cols-[minmax(180px,1.8fr)_140px_168px_130px_120px]";
const dashboardTaskKinds: ColumnKind[] = ["title", "faces", "status", "date", "mini"];

const reportColumns = "grid-cols-[80px_minmax(160px,1.6fr)_120px_110px_130px_90px]";
const reportKinds: ColumnKind[] = ["code", "title", "faces", "progress", "date", "mini"];

function DashboardSkeleton() {
  return (
    <Loading className="min-h-full">
      <div className="w-full px-4 pt-[11px] pb-6 sm:px-6">
        <div className="flex flex-col gap-4 rounded-[5px] bg-gradient-to-r from-[#ff6f28] to-[#ff541f] p-6 sm:flex-row sm:items-center sm:p-10">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <Bone className="h-8 w-72 max-w-full bg-white/35" />
            <Bone className="h-4 w-80 max-w-full bg-white/30" />
          </div>
          <div className="flex gap-2.5">
            <Bone className="h-9 w-28 rounded-[5px] bg-black/40" />
            <Bone className="h-9 w-36 rounded-[5px] bg-white/80" />
          </div>
        </div>
        <div className="mt-[10px] grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <article key={index} className="flex h-[100px] items-center gap-3 rounded-[5px] border border-[#f2f3f5] bg-white px-4">
              <Bone className="size-10 rounded-[5px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Bone className="h-7 w-16" />
                <Bone className="h-3 w-24" />
              </div>
              <Bone className="h-5 w-14 rounded-full" />
            </article>
          ))}
        </div>
        <div className="mt-[9px] grid grid-cols-1 gap-[15px] xl:grid-cols-[minmax(0,2.07fr)_minmax(300px,1fr)]">
          <section className="flex h-[402px] flex-col rounded-[5px] border border-[#f2f3f5] bg-white px-[23px] pt-6">
            <div className="flex items-center justify-between">
              <Bone className="h-4 w-40" />
              <Bone className="h-[35px] w-24 rounded-[5px]" />
            </div>
            <Bone className="mt-6 min-h-0 flex-1 rounded-t-[8px]" />
          </section>
          <section className="flex flex-col gap-3 rounded-[5px] border border-[#f2f3f5] bg-white p-5">
            <div className="flex items-center justify-between">
              <Bone className="h-4 w-36" />
              <Bone className="h-8 w-20 rounded-[5px]" />
            </div>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="h-4 w-16" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Bone className="h-4 w-32" />
                  <Bone className="h-3 w-40" />
                </div>
                <Bone className="h-7 w-14 rounded-[5px]" />
              </div>
            ))}
          </section>
        </div>
        <div className="mt-3 grid grid-cols-1 items-start gap-[15px] xl:grid-cols-[minmax(0,2.07fr)_minmax(300px,1fr)]">
          <section className="overflow-hidden rounded-[5px] bg-white shadow-[0_1px_0.5px_rgba(198,198,198,0.2)]">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-[15px]">
              <Bone className="h-4 w-20" />
              <Bone className="h-8 w-24 rounded-[5px]" />
            </div>
            <DataTable columns={dashboardTaskColumns} kinds={dashboardTaskKinds} rows={5} minWidth="min-w-[760px]" tone="card" />
          </section>
          <section className="flex flex-col gap-3 rounded-[5px] border border-[#f2f3f5] bg-white p-5">
            <div className="flex items-center justify-between">
              <Bone className="h-4 w-28" />
              <Bone className="h-8 w-20 rounded-[5px]" />
            </div>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="size-5 rounded-[6px]" />
                <Bone className="h-4 min-w-0 flex-1" />
                <Bone className="size-4" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </Loading>
  );
}

function MeetingsSkeleton() {
  return (
    <Loading className={listPage}>
      <PageHeading />
      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <ListToolbar />
        <DataTable columns={meetingColumns} kinds={meetingKinds} rows={8} />
      </section>
      <Pager />
    </Loading>
  );
}

function TasksSkeleton() {
  return (
    <Loading className={listPage}>
      <PageHeading />
      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <ListToolbar />
        <DataTable columns={taskColumns} kinds={taskKinds} rows={8} minWidth="min-w-[980px]" />
      </section>
      <Pager />
    </Loading>
  );
}

function TeamSkeleton() {
  return (
    <Loading className={listPage}>
      <PageHeading actions={2} />
      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <ListToolbar />
        <DataTable columns={teamColumns} kinds={teamKinds} rows={8} minWidth="min-w-[980px]" />
      </section>
      <Pager />
    </Loading>
  );
}

function ProjectCardSkeleton() {
  return (
    <article className="flex flex-col gap-4 rounded-[5px] border border-[#e5e7eb] bg-white p-5">
      <div className="flex items-center gap-2">
        <Bone className="size-9 rounded-[5px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Bone className="h-4 w-32" />
          <Bone className="h-3 w-24" />
        </div>
        <Bone className="h-6 w-20 rounded-full" />
      </div>
      <div className="h-px bg-[#e5e7eb]" />
      <div className="grid grid-cols-3 gap-3">
        <Bone className="h-8" />
        <Bone className="h-8" />
        <Bone className="h-8" />
      </div>
      <Bone className="h-8 w-full rounded-[5px]" />
      <div className="flex items-center justify-between">
        <div className="flex">
          {Array.from({ length: 3 }, (_, index) => (
            <Bone key={index} className={`size-6 rounded-full ${index > 0 ? "-ml-2" : ""}`} />
          ))}
        </div>
        <Bone className="h-3 w-24" />
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <Loading className={listPage}>
      <PageHeading />
      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <ListToolbar />
        <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </Loading>
  );
}

function IntegrationsSkeleton() {
  return (
    <Loading className={listPage}>
      <div className="flex h-[66px] items-center">
        <Bone className="h-7 w-36" />
      </div>
      <section className="mt-3 overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#eaecf0] px-4 pt-5 pb-[19px] sm:flex-row sm:items-center sm:px-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Bone className="h-5 w-40" />
            <Bone className="h-3.5 w-56" />
          </div>
          <div className="flex gap-3">
            <Bone className="h-8 w-20" />
            <Bone className="h-8 w-16" />
            <Bone className="h-8 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-[15px] gap-y-7 px-2.5 py-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <article key={index} className="flex min-h-[135px] flex-col gap-[17px] border border-[#eaecf0] px-[13px] py-[15px]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-[9px]">
                  <Bone className="size-6 rounded-[4px]" />
                  <Bone className="h-5 w-24" />
                </div>
                <Bone className="h-6 w-11 rounded-full" />
              </div>
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-4/5" />
            </article>
          ))}
        </div>
      </section>
      <Pager />
    </Loading>
  );
}

function ReportMetricSkeleton() {
  return (
    <article className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
      <Bone className="h-4 w-24" />
      <Bone className="mt-2 h-5 w-16" />
      <Bone className="mt-3 h-3 w-36" />
    </article>
  );
}

function ChartHeader() {
  return (
    <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-[15px]">
      <Bone className="h-4 w-32" />
      <Bone className="h-8 w-24 rounded-[5px]" />
    </div>
  );
}

function ReportSkeleton() {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-3 pb-6 sm:px-6">
      <PageHeading />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <ReportMetricSkeleton key={index} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-[5px] border border-[#e5e7eb] bg-white">
          <ChartHeader />
          <div className="px-5 py-5">
            <Bone className="h-8 w-full" />
            <Bone className="mt-3 aspect-[348/204] w-full rounded-[5px]" />
          </div>
        </section>
        <section className="rounded-[5px] border border-[#e5e7eb] bg-white">
          <ChartHeader />
          <div className="flex justify-center px-5 py-8">
            <Bone className="size-48 rounded-full" />
          </div>
        </section>
        <section className="rounded-[5px] border border-[#e5e7eb] bg-white">
          <ChartHeader />
          <div className="flex flex-col gap-4 px-5 py-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="h-3 w-16" />
                <Bone className="h-3 flex-1 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,758fr)_minmax(280px,364fr)]">
        <section className="overflow-hidden rounded-[5px] border border-[#e5e7eb] bg-white">
          <ChartHeader />
          <DataTable columns={reportColumns} kinds={reportKinds} rows={5} minWidth="min-w-[758px]" tone="card" />
        </section>
        <section className="rounded-[5px] border border-[#e5e7eb] bg-white">
          <ChartHeader />
          <div className="flex flex-col gap-3 p-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="size-9 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Bone className="h-4 w-28" />
                  <Bone className="h-3 w-20" />
                </div>
                <Bone className="h-4 w-10" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Loading>
  );
}

function SettingsSkeleton() {
  return (
    <Loading className="flex min-h-0 flex-1 flex-col bg-[#fafafa] px-4 pt-4 pb-6 sm:px-6">
      <div className="flex min-h-[640px] flex-1 flex-col overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
        <div className="px-6 pt-4">
          <Bone className="h-7 w-28" />
        </div>
        <div className="mt-4 grid min-h-0 flex-1 border-t border-[#e5e7eb] lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex gap-6 border-b border-[#e5e7eb] px-6 py-5 lg:flex-col lg:gap-8 lg:border-r lg:border-b-0">
            {Array.from({ length: 4 }, (_, index) => (
              <Bone key={index} className="h-4 w-36" />
            ))}
          </div>
          <div className="flex flex-col gap-5 px-6 py-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex max-w-[500px] flex-col gap-2">
                <Bone className="h-3.5 w-28" />
                <Bone className="h-[42px] w-full rounded-[6px]" />
              </div>
            ))}
            <Bone className="mt-2 h-[38px] w-32 rounded-[5px]" />
          </div>
        </div>
      </div>
    </Loading>
  );
}

function AccountSkeleton() {
  return (
    <Loading className="bg-[#f8f9fa] px-4 pt-4 pb-6 sm:px-6">
      <div className="flex h-[66px] items-center justify-between pr-3 pl-6">
        <Bone className="h-7 w-28" />
        <Bone className="h-[38px] w-32 rounded-[5px]" />
      </div>
      <div className="rounded-[8px] border border-[#eaecf0] bg-white px-6 py-8 sm:px-[61px]">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Bone className="size-[100px] rounded-full" />
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Bone className="h-[38px] w-[132px] rounded-[4px]" />
              <Bone className="h-[38px] w-[120px] rounded-[5px]" />
            </div>
            <Bone className="h-4 w-72" />
          </div>
        </div>
        <Bone className="mt-8 h-4 w-36" />
        <div className="mt-5 grid max-w-[793px] grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Bone className="h-3.5 w-24" />
              <Bone className="h-[42px] w-full rounded-[6px]" />
            </div>
          ))}
        </div>
        <Bone className="mt-8 h-4 w-24" />
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="mt-6 flex max-w-[793px] items-center justify-between gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Bone className="h-4 w-32" />
              <Bone className="h-3.5 w-64" />
            </div>
            <Bone className="h-[38px] w-[136px] rounded-[5px]" />
          </div>
        ))}
      </div>
    </Loading>
  );
}

function DetailHeading() {
  return (
    <div className="flex items-center justify-between gap-3">
      <Bone className="h-5 w-28" />
      <Bone className="h-[38px] w-28 rounded-[5px]" />
    </div>
  );
}

function MeetingDetailSkeleton() {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:px-6">
      <div className="grid items-start gap-[9px] xl:grid-cols-[minmax(0,1.26fr)_minmax(320px,1fr)]">
        <article className="overflow-hidden rounded-[12px] bg-white">
          <div className="flex h-[66px] items-center border-b border-[#e2e4e9] px-6">
            <Bone className="h-5 w-24" />
          </div>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="flex items-start justify-between">
              <Bone className="h-6 w-56" />
              <Bone className="h-[26px] w-[100px] rounded-[3px]" />
            </div>
            <Bone className="h-4 w-48" />
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Bone className="h-4 w-20" />
                <Bone className="h-6 w-28 rounded-[5px]" />
              </div>
            ))}
          </div>
        </article>
        <article className="flex flex-col gap-3 rounded-[12px] bg-white p-5">
          <Bone className="h-5 w-28" />
          {Array.from({ length: 6 }, (_, index) => (
            <Bone key={index} className="h-10 w-full rounded-[5px]" />
          ))}
        </article>
      </div>
    </Loading>
  );
}

function TaskDetailSkeleton() {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <DetailHeading />
      <article className="mt-6 rounded-[5px] border border-[#e5e7eb] bg-white p-5">
        <Bone className="h-16 w-full rounded-[5px]" />
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Bone className="h-4 w-24" />
              <Bone className="h-6 w-32 rounded-[5px]" />
            </div>
          ))}
        </div>
        <Bone className="mt-6 h-24 w-full rounded-[5px]" />
      </article>
    </Loading>
  );
}

function ProjectDetailSkeleton() {
  return (
    <Loading className="flex flex-col gap-6 bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <DetailHeading />
      <article className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
        <div className="flex items-center gap-3 rounded-[5px] bg-[#fafbfb] p-4">
          <Bone className="size-8 rounded-[5px]" />
          <div className="flex flex-col gap-2">
            <Bone className="h-5 w-48" />
            <Bone className="h-4 w-32" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Bone className="h-3.5 w-20" />
              <Bone className="h-5 w-28" />
            </div>
          ))}
        </div>
      </article>
      <section className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
        <Bone className="h-4 w-24" />
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Bone key={index} className="h-10 w-full rounded-[5px]" />
          ))}
        </div>
      </section>
    </Loading>
  );
}

function TeamDetailSkeleton() {
  return (
    <Loading className="flex flex-col gap-6 bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <DetailHeading />
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[364px_minmax(0,1fr)]">
        <article className="flex flex-col items-center gap-3 rounded-[5px] border border-[#e5e7eb] bg-white px-5 py-8">
          <Bone className="size-[72px] rounded-full" />
          <Bone className="h-4 w-32" />
          <Bone className="h-6 w-28 rounded-[5px]" />
          <Bone className="mt-4 h-4 w-full" />
          <Bone className="h-4 w-full" />
        </article>
        <div className="flex flex-col gap-4">
          <section className="rounded-[5px] border border-[#e5e7eb] bg-white p-5">
            <Bone className="h-4 w-28" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Loading>
  );
}

export function PageSkeleton({
  section,
  detail = false,
}: {
  section: SectionId;
  detail?: boolean;
}) {
  if (section === "dashboard") return <DashboardSkeleton />;
  if (section === "meetings") return detail ? <MeetingDetailSkeleton /> : <MeetingsSkeleton />;
  if (section === "tasks") return detail ? <TaskDetailSkeleton /> : <TasksSkeleton />;
  if (section === "projects") return detail ? <ProjectDetailSkeleton /> : <ProjectsSkeleton />;
  if (section === "team") return detail ? <TeamDetailSkeleton /> : <TeamSkeleton />;
  if (section === "integration") return <IntegrationsSkeleton />;
  if (section === "report") return <ReportSkeleton />;
  if (section === "settings") return <SettingsSkeleton />;
  return <AccountSkeleton />;
}
