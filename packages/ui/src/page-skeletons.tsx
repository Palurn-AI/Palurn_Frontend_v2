import type { ReactNode } from "react";

import type { SectionId } from "@palurn/api";

import { Skeleton } from "./components/skeleton.tsx";

const bone = "bg-[#eceef2]";

function Loading({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div className={className} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}

function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <article className={`flex h-[100px] items-center gap-3 rounded-[5px] border border-[#f2f3f5] bg-white px-4 ${className}`}>
      <Skeleton className={`size-10 shrink-0 rounded-[5px] ${bone}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className={`h-6 w-16 ${bone}`} />
        <Skeleton className={`h-3 w-24 ${bone}`} />
      </div>
      <Skeleton className={`h-5 w-12 rounded-full ${bone}`} />
    </article>
  );
}

function GraphSkeleton({ className = "" }: { className?: string }) {
  const bars = ["42%", "68%", "36%", "74%", "52%", "80%", "48%", "64%", "38%", "70%"];

  return (
    <section className={`flex min-h-[320px] flex-col rounded-[5px] border border-[#f2f3f5] bg-white px-5 pt-6 pb-5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className={`h-4 w-36 ${bone}`} />
        <Skeleton className={`h-8 w-24 rounded-[5px] ${bone}`} />
      </div>
      <div className="mt-6 flex min-h-[220px] flex-1 items-end gap-2 border-b border-[#f2f3f5] pb-3">
        {bars.map((height, index) => (
          <Skeleton key={index} className={`min-w-0 flex-1 rounded-t-[4px] ${bone}`} style={{ height }} />
        ))}
      </div>
    </section>
  );
}

function TableSkeleton({ columns = 6, rows = 6 }: { columns?: number; rows?: number }) {
  const widths = ["w-8", "w-[42%]", "w-24", "w-20", "w-16", "w-28", "w-20", "w-14"];

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#eaecf0] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#eaecf0] px-4 py-5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className={`h-5 w-40 ${bone}`} />
          <Skeleton className={`h-3 w-56 ${bone}`} />
        </div>
        <div className="flex gap-2">
          <Skeleton className={`h-8 w-16 rounded-[5px] ${bone}`} />
          <Skeleton className={`h-8 w-16 rounded-[5px] ${bone}`} />
          <Skeleton className={`h-8 w-20 rounded-[5px] ${bone}`} />
        </div>
      </div>
      <div className="flex items-center gap-4 border-b border-[#eaecf0] bg-[#fcfcfd] px-6 py-4">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className={`h-3 ${index === 0 ? "w-4" : "w-16"} ${bone}`} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-center gap-4 border-b border-[#f8f9fa] px-6 py-4 last:border-b-0">
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} className={`h-4 ${widths[(column + row) % widths.length]} ${bone}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PageHeading() {
  return (
    <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-3">
      <Skeleton className={`h-7 w-36 ${bone}`} />
      <Skeleton className={`h-10 w-32 rounded-[4px] ${bone}`} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <Loading className="min-h-full">
      <div className="w-full px-4 pt-[11px] pb-6 sm:px-6">
        <div className="flex flex-col gap-4 rounded-[5px] bg-[#ffe8df] p-6 sm:flex-row sm:items-center sm:p-10">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <Skeleton className="h-8 w-64 max-w-full bg-white/70" />
            <Skeleton className="h-4 w-80 max-w-full bg-white/70" />
          </div>
          <div className="flex gap-2.5">
            <Skeleton className="h-9 w-28 rounded-[5px] bg-white/80" />
            <Skeleton className="h-9 w-32 rounded-[5px] bg-white/80" />
          </div>
        </div>
        <div className="mt-[10px] grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
        <div className="mt-[9px] grid grid-cols-1 gap-[15px] xl:grid-cols-[minmax(0,2.07fr)_minmax(300px,1fr)]">
          <GraphSkeleton className="h-[402px]" />
          <div className="flex flex-col gap-3 rounded-[5px] border border-[#f2f3f5] bg-white p-5">
            <Skeleton className={`h-4 w-32 ${bone}`} />
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className={`h-12 w-full rounded-[5px] ${bone}`} />
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 items-start gap-[15px] xl:grid-cols-[minmax(0,2.07fr)_minmax(300px,1fr)]">
          <TableSkeleton columns={5} rows={5} />
          <div className="flex flex-col gap-3 rounded-[5px] border border-[#f2f3f5] bg-white p-5">
            <Skeleton className={`h-4 w-28 ${bone}`} />
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className={`h-10 w-full rounded-[5px] ${bone}`} />
            ))}
          </div>
        </div>
      </div>
    </Loading>
  );
}

function TablePageSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <PageHeading />
      <div className="mt-3">
        <TableSkeleton columns={columns} rows={8} />
      </div>
    </Loading>
  );
}

function CardPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-[17px] pb-6 sm:pr-6 sm:pl-9">
      <PageHeading />
      <div className="mt-3 grid grid-cols-1 gap-3 rounded-[8px] border border-[#eaecf0] bg-white p-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <CardSkeleton key={index} className="h-[148px]" />
        ))}
      </div>
    </Loading>
  );
}

function ReportSkeleton() {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-3 pb-6 sm:px-6">
      <PageHeading />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GraphSkeleton />
        <GraphSkeleton />
        <GraphSkeleton />
      </div>
    </Loading>
  );
}

function DetailSkeleton({ table = false }: { table?: boolean }) {
  return (
    <Loading className="bg-[#fafafa] px-4 pt-4 pb-8 sm:px-6">
      <div className="flex items-center justify-between">
        <Skeleton className={`h-5 w-24 ${bone}`} />
        <Skeleton className={`h-9 w-28 rounded-[5px] ${bone}`} />
      </div>
      <div className="mt-6 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="flex flex-col gap-4 rounded-[5px] border border-[#e5e7eb] bg-white p-5">
          <Skeleton className={`h-16 w-full rounded-[5px] ${bone}`} />
          <Skeleton className={`h-4 w-3/4 ${bone}`} />
          <Skeleton className={`h-4 w-1/2 ${bone}`} />
          <Skeleton className={`h-4 w-2/3 ${bone}`} />
          {table ? <TableSkeleton columns={4} rows={4} /> : <CardSkeleton className="h-[120px]" />}
        </div>
        <div className="flex flex-col gap-3">
          <CardSkeleton className="h-[140px]" />
          <CardSkeleton className="h-[180px]" />
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
  if (section === "report") return <ReportSkeleton />;
  if (section === "meetings") return detail ? <DetailSkeleton table /> : <TablePageSkeleton columns={6} />;
  if (section === "tasks") return detail ? <DetailSkeleton /> : <TablePageSkeleton columns={8} />;
  if (section === "team") return detail ? <DetailSkeleton /> : <TablePageSkeleton columns={7} />;
  if (section === "projects") return detail ? <DetailSkeleton table /> : <CardPageSkeleton count={6} />;
  if (section === "integration") return <CardPageSkeleton count={8} />;
  return <CardPageSkeleton count={4} />;
}
