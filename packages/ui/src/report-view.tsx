import { logAction } from "./log-action.ts";
import { useState } from "react";

import { OptionMenu } from "./components/dropdown-menu.tsx";
import type {
  ReportMetric,
  ReportMetricTone,
  ReportPerformer,
  ReportPerformerTone,
  ReportPriority,
  ReportProject,
  ReportResponse,
  ReportTaskStat,
} from "@palurn/api";

import accentBlue from "./assets/report/accent-blue.svg";
import accentGreen from "./assets/report/accent-green.svg";
import accentNavy from "./assets/report/accent-navy.svg";
import accentOrange from "./assets/report/accent-orange.svg";
import accentPurple from "./assets/report/accent-purple.svg";
import arrowDown from "./assets/report/arrow-down.svg";
import arrowUp from "./assets/report/arrow-up.svg";
import attendanceAxis from "./assets/report/attendance-axis.svg";
import attendanceFill from "./assets/report/attendance-fill.svg";
import attendanceLine from "./assets/report/attendance-line.svg";
import attendanceTicks from "./assets/report/attendance-ticks.svg";
import calendarIcon from "./assets/report/calendar.svg";
import deptDot from "./assets/report/dept-dot.svg";
import exportIcon from "./assets/report/export.svg";
import face1 from "./assets/report/face-1.png";
import face2 from "./assets/report/face-2.png";
import face3 from "./assets/report/face-3.png";
import face4 from "./assets/report/face-4.png";
import face5 from "./assets/report/face-5.png";
import face6 from "./assets/report/face-6.png";
import face7 from "./assets/report/face-7.png";
import face8 from "./assets/report/face-8.png";
import face9 from "./assets/report/face-9.png";
import face10 from "./assets/report/face-10.png";
import face11 from "./assets/report/face-11.png";
import face12 from "./assets/report/face-12.png";
import legendCompleted from "./assets/report/legend-completed.svg";
import legendHold from "./assets/report/legend-hold.svg";
import legendOngoing from "./assets/report/legend-ongoing.svg";
import legendOverdue from "./assets/report/legend-overdue.svg";
import ring58 from "./assets/report/ring-58.svg";
import ring61 from "./assets/report/ring-61.svg";
import ring70 from "./assets/report/ring-70.svg";
import ring85 from "./assets/report/ring-85.svg";
import ring95 from "./assets/report/ring-95.svg";
import ringTrack from "./assets/report/ring-track.svg";
import trendIcon from "./assets/report/trend.svg";
import chevronLeftIcon from "./assets/meetings/chevron-left.svg";
import chevronRightIcon from "./assets/meetings/chevron-right.svg";
import dotsIcon from "./assets/meetings/dots.svg";

const faces: Record<string, string> = {
  "1": face1,
  "2": face2,
  "3": face3,
  "4": face4,
  "5": face5,
  "6": face6,
  "7": face7,
  "8": face8,
  "9": face9,
  "10": face10,
  "11": face11,
  "12": face12,
};

const metricTone: Record<ReportMetricTone, { bar: string; text: string }> = {
  pink: { bar: "bg-[#fd3995]", text: "text-[#03c95a]" },
  purple: { bar: "bg-[#ab47bc]", text: "text-[#03c95a]" },
  green: { bar: "bg-[#03c95a]", text: "text-[#03c95a]" },
  red: { bar: "bg-[#e70d0d]", text: "text-[#e70d0d]" },
};

const priorityTone: Record<ReportPriority, string> = {
  high: "bg-[#cc4039]",
  low: "bg-[#9856a4]",
  medium: "bg-[#03c95a]",
};

const legendIcons: Record<string, string> = {
  ongoing: legendOngoing,
  hold: legendHold,
  overdue: legendOverdue,
  completed: legendCompleted,
};

const performerStyle: Record<ReportPerformerTone, { accent: string; arc: string; arcClass: string }> = {
  orange: { accent: accentOrange, arc: ring95, arcClass: "inset-x-0 top-[7.15%] bottom-0" },
  green: { accent: accentGreen, arc: ring85, arcClass: "top-[7.67%] right-0 bottom-0 left-[1.38%]" },
  purple: { accent: accentPurple, arc: ring70, arcClass: "top-[7.67%] right-0 bottom-0 left-[1.38%]" },
  blue: { accent: accentBlue, arc: ring61, arcClass: "top-[7.67%] right-0 bottom-0 left-[1.38%]" },
  navy: { accent: accentNavy, arc: ring58, arcClass: "top-[3.78%] right-0 bottom-0 left-[23.65%]" },
};

const cardClass =
  "rounded-[5px] border border-[#e5e7eb] bg-white shadow-[0_1px_1px_1px_rgba(198,198,198,0.2)]";

const attendanceSeries = [
  { day: "Mon", value: "72%", left: "14%", top: "58%" },
  { day: "Tue", value: "84%", left: "32%", top: "33%" },
  { day: "Wed", value: "78%", left: "50%", top: "44%" },
  { day: "Thur", value: "91%", left: "68%", top: "22%" },
  { day: "Fri", value: "98%", left: "86%", top: "6%" },
] as const;

export function ReportView({ data }: { data: ReportResponse }) {
  const [page, setPage] = useState(data.page);
  const [attendanceDay, setAttendanceDay] = useState<string | null>(null);
  const [taskStat, setTaskStat] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  function selectPage(next: number) {
    setPage(next);
    logAction("Change report page", next);
  }

  return (
    <div className="bg-[#fafafa] px-4 pt-3 pb-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center gap-2.5 rounded-[4px] bg-[#f04e1a] px-4 text-[14px] leading-4 text-white hover:bg-[#e44512]"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={() => logAction("Export report")}
        >
          <img alt="" src={exportIcon} className="size-3.5" />
          {data.exportLabel}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onOpen={() => logAction("Open report metric", metric)}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,385fr)_minmax(0,362fr)_minmax(0,362fr)]">
        <section className={cardClass}>
          <CardHeader title={data.attendance.title} ranges={data.ranges} initial={data.rangeLabel} />
          <div className="px-5 pt-5 pb-4">
            <div className="flex h-8 items-center gap-2 bg-[#fafbfb] px-2">
              <p className="text-[20px] leading-6 font-bold text-[#080808]">{data.attendance.value}</p>
              <span className="inline-flex items-center rounded-full border border-[#009ddc] bg-[#eaf8f0] p-1 text-[12px] leading-4 font-medium text-[#009ddc]">
                <img alt="" src={trendIcon} className="size-3" />
                {data.attendance.change}
              </span>
              <p className="text-[14px] leading-6 text-[#6b7280]">{data.attendance.comparison}</p>
            </div>
            <div className="relative mt-3 aspect-[348/204] w-full">
              <img alt="" src={attendanceFill} className="pointer-events-none absolute top-0 left-0 h-[77.8%] w-full object-fill" />
              <img alt="" src={attendanceLine} className="pointer-events-none absolute top-0 left-[0.9%] h-[66.7%] w-[98.9%] object-fill" />
              <img alt="" src={attendanceAxis} className="pointer-events-none absolute top-[77.8%] left-[0.9%] h-px w-[99%] object-fill" />
              <img alt="" src={attendanceTicks} className="pointer-events-none absolute top-[74.5%] left-[10.7%] h-[3.6%] w-[76.3%] object-fill" />
              {attendanceSeries.map((point) => {
                const active = attendanceDay === point.day;
                return (
                  <button
                    key={point.day}
                    type="button"
                    aria-label={`${point.day} attendance ${point.value}`}
                    className="absolute top-0 h-[78%] w-[18%] -translate-x-1/2 cursor-crosshair"
                    style={{ left: point.left }}
                    onMouseEnter={() => setAttendanceDay(point.day)}
                    onMouseLeave={() => setAttendanceDay((current) => (current === point.day ? null : current))}
                    onClick={() => {
                      setAttendanceDay(point.day);
                      logAction("Inspect attendance", point);
                    }}
                  >
                    {active ? (
                      <>
                        <span className="pointer-events-none absolute top-0 left-1/2 h-full border-l border-dashed border-[#009ddc]" />
                        <span
                          className="pointer-events-none absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#009ddc] shadow-[0_1px_6px_rgba(0,157,220,0.35)]"
                          style={{ top: point.top }}
                        />
                        <span
                          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-[5px] border border-[#e5e7eb] bg-white px-2 py-1 text-left shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
                          style={{ top: `calc(${point.top} - 46px)` }}
                        >
                          <span className="block text-[12px] leading-4 font-medium whitespace-nowrap text-[#111827]">{point.day}</span>
                          <span className="block text-[12px] leading-4 font-semibold whitespace-nowrap text-[#009ddc]">{point.value}</span>
                        </span>
                      </>
                    ) : null}
                  </button>
                );
              })}
              <div className="pointer-events-none absolute inset-x-[5%] bottom-0 flex">
                {data.attendance.days.map((day) => (
                  <span
                    key={day}
                    className={`flex-1 text-center text-[16px] leading-4 font-medium ${attendanceDay === day ? "text-[#009ddc]" : "text-[#111827]"}`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <CardHeader title={data.tasks.title} ranges={data.ranges} initial={data.rangeLabel} />
          <div className="px-5 py-5">
            <div className="relative mx-auto aspect-[323/310] w-full max-w-[420px]">
              <TaskDonut stats={data.tasks.stats} active={taskStat} onHover={setTaskStat} />
              <div className="pointer-events-none absolute top-[42%] left-1/2 w-[34%] -translate-x-1/2 text-center">
                <p className="text-[13px] leading-4 text-[#6b7280]">{data.tasks.totalLabel}</p>
                <p className="mt-1 text-[24px] leading-6 font-bold text-[#111827]">{data.tasks.total}</p>
              </div>
              <div className="absolute inset-x-0 top-[84%] flex">
                {data.tasks.stats.map((stat, index) => (
                  <TaskStat
                    key={stat.id}
                    stat={stat}
                    divided={index > 0}
                    active={taskStat === stat.label}
                    onHover={setTaskStat}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <CardHeader title={data.departments.title} ranges={data.ranges} initial={data.rangeLabel} />
          <div className="flex h-auto flex-col gap-4 px-5 py-5 sm:h-[275px]">
            <div className="flex min-h-0 flex-1 gap-5">
              <div className="flex w-[78px] shrink-0 flex-col justify-between pb-7 text-right text-[13px] leading-4 text-[#111827]">
                {data.departments.items.map((item) => (
                  <span key={item.name}>{item.name}</span>
                ))}
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex h-[calc(100%-28px)] flex-col justify-between">
                  {data.departments.items.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      aria-label={`${item.name} ${item.value}`}
                      className="group relative h-3 cursor-pointer rounded-[10px] bg-[#f8f9fa]"
                      onMouseEnter={() => setDepartment(item.name)}
                      onMouseLeave={() => setDepartment((current) => (current === item.name ? null : current))}
                      onClick={() => {
                        setDepartment(item.name);
                        logAction("Inspect department", item);
                      }}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 rounded-[10px] bg-gradient-to-r from-[#ff6f28] to-[#ff5325] transition-[filter] ${department === item.name ? "brightness-110" : ""}`}
                        style={{ width: `${item.value}%` }}
                      />
                      {department === item.name ? (
                        <span
                          className="pointer-events-none absolute bottom-4 z-10 -translate-x-1/2 rounded-[5px] bg-[#111827] px-2 py-1 text-[12px] leading-4 whitespace-nowrap text-white"
                          style={{ left: `${item.value}%` }}
                        >
                          {item.name} · {item.value}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[13px] leading-4 text-[#111827]">
                  {data.departments.scale.map((mark) => (
                    <span key={mark}>{mark}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="flex items-center justify-center gap-2 text-center text-[13px] leading-4 text-[#6b7280]">
              <img alt="" src={deptDot} className="size-2 shrink-0" />
              <span>
                {data.departments.footnote} <span className="font-bold text-[#03c95a]">{data.departments.footnoteValue}</span>{" "}
                {data.departments.footnoteTrail}
              </span>
            </p>
          </div>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,758fr)_minmax(280px,364fr)]">
        <section className={cardClass}>
          <CardHeader title={data.projectsTitle} ranges={data.ranges} initial={data.rangeLabel} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[758px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f8f9fa] text-[14px] leading-6 font-semibold text-[#111827]">
                  <th className="px-5 py-1.5 font-semibold">ID</th>
                  <th className="px-5 py-1.5 font-semibold">Name</th>
                  <th className="px-5 py-1.5 font-semibold">Team</th>
                  <th className="px-5 py-1.5 font-semibold">Hours</th>
                  <th className="px-5 py-1.5 font-semibold">Deadline</th>
                  <th className="px-5 py-1.5 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    selected={selectedProject === project.id}
                    onOpen={() => {
                      setSelectedProject(project.id);
                      logAction("Open report project", project);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end px-5 py-[15px]">
            <div className="flex items-center gap-[15px]">
              <button type="button" aria-label="Previous page" className="cursor-pointer" onClick={() => selectPage(Math.max(1, page - 1))}>
                <img alt="" src={chevronLeftIcon} className="size-4" />
              </button>
              <div className="flex items-center gap-2">
                {data.pages.map((item) => (
                  <PageButton key={item} page={item} active={item === page} onSelect={selectPage} />
                ))}
                <img alt="" src={dotsIcon} className="size-3.5" />
                <PageButton page={data.lastPage} active={page === data.lastPage} onSelect={selectPage} />
              </div>
              <button type="button" aria-label="Next page" className="cursor-pointer" onClick={() => selectPage(Math.min(data.lastPage, page + 1))}>
                <img alt="" src={chevronRightIcon} className="size-4" />
              </button>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <CardHeader title={data.performersTitle} ranges={data.ranges} initial={data.rangeLabel} />
          <ul className="flex flex-col gap-2 p-5">
            {data.performers.map((person) => (
              <PerformerRow
                key={person.id}
                person={person}
                onOpen={() => logAction("Open performer", person)}
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function CardHeader({ title, ranges, initial }: { title: string; ranges: string[]; initial: string }) {
  const [range, setRange] = useState(initial);

  return (
    <div className="flex items-center gap-2.5 border-b border-[#e5e7eb] px-5 py-[15px]">
      <h2 className="min-w-0 flex-1 text-[16px] leading-6 font-semibold text-[#111827]">{title}</h2>
      <OptionMenu
        options={ranges}
        value={range}
        onSelect={(option) => {
          setRange(option);
          logAction("Change report range", { source: title, range: option });
        }}
        className="inline-flex cursor-pointer items-center gap-1 rounded-[5px] border border-[#e5e7eb] bg-white px-2 py-[7px] text-[12px] leading-4 text-[#111827] hover:bg-[#f8f9fa]"
      >
        <img alt="" src={calendarIcon} className="size-3.5" />
        {range}
      </OptionMenu>
    </div>
  );
}

function MetricCard({ metric, onOpen }: { metric: ReportMetric; onOpen: () => void }) {
  const tone = metricTone[metric.tone];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="cursor-pointer rounded-[5px] border border-[#e5e7eb] bg-white p-5 text-left hover:border-[#ff541f] hover:shadow-[0_8px_20px_rgba(255,84,31,0.12)]"
    >
      <p className="text-[14px] leading-6 text-[#6b7280]">{metric.label}</p>
      <p className="text-[16px] leading-6 font-semibold text-[#111827]">{metric.value}</p>
      <p className="mt-2 flex items-center gap-1 text-[12px] leading-4">
        <img alt="" src={metric.direction === "up" ? arrowUp : arrowDown} className="size-3" />
        <span className={`font-medium ${tone.text}`}>{metric.change}</span>
        <span className="text-[#6b7280]">from last month</span>
      </p>
    </button>
  );
}

const taskFrame = { width: 323, height: 310 };

const taskChart = {
  cx: 161.5,
  cy: 196,
  radius: 142,
  stroke: 52,
  track: 66,
};

const taskSlices = [
  { label: "Ongoing", fill: "#FFC107", sweep: 50 },
  { label: "On Hold", fill: "#1B84FF", sweep: 70 },
  { label: "Completed", fill: "#03C95A", sweep: 36 },
  { label: "Overdue", fill: "#E70D0D", sweep: 24 },
] as const;

function arcPoint(deg: number, radius = taskChart.radius) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: taskChart.cx + radius * Math.cos(rad),
    y: taskChart.cy + radius * Math.sin(rad),
  };
}

function arcPath(start: number, end: number) {
  const from = arcPoint(start);
  const to = arcPoint(end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${from.x} ${from.y} A ${taskChart.radius} ${taskChart.radius} 0 ${large} 1 ${to.x} ${to.y}`;
}

function TaskDonut({
  stats,
  active,
  onHover,
}: {
  stats: ReportTaskStat[];
  active: string | null;
  onHover: (label: string | null) => void;
}) {
  const cap = (taskChart.track / 2 / taskChart.radius) * (180 / Math.PI);
  const start = 180 + cap;
  const end = 360 - cap;
  let cursor = start;
  const slices = taskSlices.map((slice) => {
    const sliceStart = cursor;
    const sliceEnd = cursor + ((end - start) * slice.sweep) / 180;
    cursor = sliceEnd;
    const mid = arcPoint((sliceStart + sliceEnd) / 2, taskChart.radius + taskChart.stroke / 2 + 14);
    return { ...slice, sliceStart, sliceEnd, tip: { left: `${(mid.x / taskFrame.width) * 100}%`, top: `${(mid.y / taskFrame.height) * 100}%` } };
  });
  const hovered = slices.find((slice) => slice.label === active);
  const hoveredStat = stats.find((stat) => stat.label === active);

  return (
    <>
      <svg viewBox={`0 0 ${taskFrame.width} ${taskFrame.height}`} className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <path d={arcPath(start, end)} fill="none" stroke="#F8F9FA" strokeWidth={taskChart.track} strokeLinecap="round" />
        {slices.map((slice) => {
          const stat = stats.find((item) => item.label === slice.label);
          const dimmed = active !== null && active !== slice.label;
          return (
            <path
              key={slice.label}
              d={arcPath(slice.sliceStart, slice.sliceEnd)}
              fill="none"
              stroke={slice.fill}
              strokeWidth={taskChart.stroke}
              strokeLinecap="round"
              role="button"
              tabIndex={0}
              aria-label={stat ? `${slice.label} ${stat.value}` : slice.label}
              className="pointer-events-auto cursor-pointer outline-none"
              style={{
                opacity: dimmed ? 0.35 : 1,
                transition: "opacity 180ms ease",
              }}
              onMouseEnter={() => onHover(slice.label)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(slice.label)}
              onBlur={() => onHover(null)}
              onClick={() => {
                onHover(slice.label);
                logAction("Inspect task statistic", { label: slice.label, value: stat?.value });
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onHover(slice.label);
                logAction("Inspect task statistic", { label: slice.label, value: stat?.value });
              }}
            />
          );
        })}
      </svg>
      {hovered && hoveredStat ? (
        <span
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-[5px] bg-[#111827] px-2 py-1 text-[12px] leading-4 whitespace-nowrap text-white"
          style={{ left: hovered.tip.left, top: hovered.tip.top }}
        >
          {hovered.label} · {hoveredStat.value}
        </span>
      ) : null}
    </>
  );
}

function TaskStat({
  stat,
  divided,
  active,
  onHover,
}: {
  stat: ReportTaskStat;
  divided: boolean;
  active: boolean;
  onHover: (label: string | null) => void;
}) {
  return (
    <button
      type="button"
      className={`flex flex-1 cursor-pointer flex-col items-center gap-[5px] ${divided ? "border-l border-[#e5e7eb]" : ""} ${active ? "bg-[#f8f9fa]" : ""}`}
      onMouseEnter={() => onHover(stat.label)}
      onMouseLeave={() => onHover(null)}
      onClick={() => {
        onHover(stat.label);
        logAction("Inspect task statistic", stat);
      }}
    >
      <p className="flex items-center gap-[5px] text-[13px] leading-4 text-[#6b7280]">
        <img alt="" src={legendIcons[stat.id]} className="size-2.5" />
        {stat.label}
      </p>
      <p className="text-[16px] leading-6 font-semibold text-[#111827]">{stat.value}</p>
    </button>
  );
}

function ProjectRow({ project, selected, onOpen }: { project: ReportProject; selected: boolean; onOpen: () => void }) {
  return (
    <tr
      className={`h-14 cursor-pointer border-b border-[#f8f9fa] text-[14px] leading-6 ${selected ? "bg-[#fff4ef]" : "hover:bg-[#f4f5f7]"}`}
      onClick={onOpen}
    >
      <td className="px-5 whitespace-nowrap text-[#6b7280]">{project.code}</td>
      <td className="px-5 font-medium whitespace-pre text-[#111827]">{project.name}</td>
      <td className="px-5">
        <div className="flex items-center">
          {project.team.map((face, index) => (
            <img
              key={`${project.id}-${face}`}
              alt=""
              src={faces[face]}
              className={`size-6 rounded-full border border-white object-cover ${index > 0 ? "-ml-2.5" : ""}`}
            />
          ))}
          {project.extra ? (
            <span className="-ml-2.5 flex size-6 items-center justify-center rounded-full bg-[#f26522] text-[10px] leading-none font-medium text-white">
              {project.extra}
            </span>
          ) : null}
        </div>
      </td>
      <td className="px-5">
        <div className="w-[86px]">
          <p className="text-[#6b7280]">{project.hours}</p>
          <div className="mt-1 h-1 overflow-hidden rounded-[10px] bg-[#f8f9fa]">
            <div
              className="h-full rounded-[10px] bg-gradient-to-r from-[#ff6f28] to-[#ff5325]"
              style={{ width: `${project.hoursFill * 100}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-5 whitespace-nowrap text-[#6b7280]">{project.deadline}</td>
      <td className="px-5">
        <span className={`inline-flex h-5 w-[60px] items-center justify-center rounded-[5px] text-[10px] leading-none font-medium text-white ${priorityTone[project.priority]}`}>
          {project.priority === "high" ? "High" : project.priority === "low" ? "Low" : "Medium"}
        </span>
      </td>
    </tr>
  );
}

function PageButton({ page, active, onSelect }: { page: number; active: boolean; onSelect: (page: number) => void }) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "flex size-6 cursor-pointer items-center justify-center rounded-[20px] bg-[#f26522] text-[12px] leading-4 text-white"
          : "flex size-6 cursor-pointer items-center justify-center rounded-[20px] border border-[#e5e7eb] text-[12px] leading-4 text-[#6b7280]"
      }
      onClick={() => onSelect(page)}
    >
      {page}
    </button>
  );
}

function PerformerRow({ person, onOpen }: { person: ReportPerformer; onOpen: () => void }) {
  const style = performerStyle[person.tone];
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[5px] border border-dashed border-[#e5e7eb] bg-[#f9fafb] p-2 text-left hover:border-[#ff541f] hover:bg-white"
      >
      <div className="flex min-w-0 items-center gap-2">
        <img alt="" src={style.accent} className="h-2.5 w-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-[14px] leading-6 font-medium text-[#111827]">{person.name}</p>
          <p className="truncate text-[13px] leading-4 text-[#6b7280]">{person.role}</p>
        </div>
      </div>
      <div className="relative size-9 shrink-0">
        <img alt="" src={ringTrack} className="absolute inset-0 size-full" />
        <img alt="" src={style.arc} className={`absolute object-fill ${style.arcClass}`} />
        <span className="absolute inset-0 flex items-center justify-center text-[12px] leading-4 text-[#6b7280]">{person.score}</span>
      </div>
        </button>
    </li>
  );
}
