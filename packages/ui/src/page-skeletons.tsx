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

function TableGrid({ columns, count, rows }: { columns: string; count: number; rows: number }) {
  return (
    <div className="overflow-x-auto">
      <div className={`grid min-w-[920px] ${columns}`}>
        {Array.from({ length: rows + 1 }, (_, row) =>
          Array.from({ length: count }, (_, column) => (
            <div
              key={`${row}-${column}`}
              className={`flex h-14 items-center px-5 ${row === 0 ? "border-b border-[#eaecf0] bg-[#fcfcfd]" : "border-b border-[#f8f9fa]"}`}
            >
              <Bone className={`h-4 ${column === 0 ? "size-5 rounded-[6px]" : row === 0 ? "w-16" : "w-24"}`} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}

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
            <TableGrid columns="grid-cols-[1.8fr_140px_168px_130px_120px]" count={5} rows={5} />
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
        <TableGrid columns="grid-cols-[54px_1.6fr_140px_140px_120px_120px_48px]" count={7} rows={8} />
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
        <TableGrid columns="grid-cols-[54px_1.5fr_120px_100px_90px_100px_110px_90px_48px]" count={9} rows={8} />
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
        <TableGrid columns="grid-cols-[54px_1.4fr_1.4fr_110px_130px_100px_120px_48px]" count={8} rows={8} />
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
          <TableGrid columns="grid-cols-[80px_1.4fr_1fr_90px_120px_100px]" count={6} rows={5} />
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
