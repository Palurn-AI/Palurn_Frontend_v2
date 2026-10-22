import { logAction } from "./log-action.ts";
import {
  useDashboard,
  type DashboardMeeting,
  type DashboardMetric,
  type DashboardResponse,
  type DashboardTask,
  type DashboardTaskStatus,
  type DashboardTodo,
} from "@palurn/api";
import { useEffect, useId, useRef, useState } from "react";

import { OptionMenu } from "./components/dropdown-menu.tsx";

import addIcon from "./assets/dashboard/add.svg";
import avatar from "./assets/dashboard/avatar.png";
import bannerGlow from "./assets/dashboard/banner-glow.svg";
import bannerOrb from "./assets/dashboard/banner-orb.png";
import bellIcon from "./assets/dashboard/bell.svg";
import blinkGold from "./assets/dashboard/blink-gold.svg";
import blinkPurple from "./assets/dashboard/blink-purple.svg";
import buildingIcon from "./assets/dashboard/building.svg";
import calendarIcon from "./assets/dashboard/calendar.svg";
import checkIcon from "./assets/dashboard/check.svg";
import chevronChart from "./assets/dashboard/chevron-chart.svg";
import chevronSm from "./assets/dashboard/chevron-sm.svg";
import chevronIcon from "./assets/dashboard/chevron.svg";
import diamond from "./assets/dashboard/diamond.png";
import dot1 from "./assets/dashboard/dot-1.svg";
import dot2 from "./assets/dashboard/dot-2.svg";
import dot3 from "./assets/dashboard/dot-3.svg";
import dot4 from "./assets/dashboard/dot-4.svg";
import face1 from "./assets/dashboard/face-1.png";
import face2 from "./assets/dashboard/face-2.png";
import face3 from "./assets/dashboard/face-3.png";
import face4 from "./assets/dashboard/face-4.png";
import face5 from "./assets/dashboard/face-5.png";
import face6 from "./assets/dashboard/face-6.png";
import face7 from "./assets/dashboard/face-7.png";
import face8 from "./assets/dashboard/face-8.png";
import face9 from "./assets/dashboard/face-9.png";
import face10 from "./assets/dashboard/face-10.png";
import face11 from "./assets/dashboard/face-11.png";
import face12 from "./assets/dashboard/face-12.png";
import grid from "./assets/dashboard/grid.svg";
import pieIcon from "./assets/dashboard/pie.svg";
import priorityDot from "./assets/dashboard/priority-dot.svg";
import searchIcon from "./assets/dashboard/search.svg";
import starFilled from "./assets/dashboard/star-filled.svg";
import starIcon from "./assets/dashboard/star.svg";
import subtaskIcon from "./assets/dashboard/subtask.svg";
import timeline from "./assets/dashboard/timeline.svg";
import usersIcon from "./assets/dashboard/users.svg";
import { SidebarTrigger } from "./components/sidebar.tsx";
import { DashboardModals, type DashboardModal } from "./dashboard-modals.tsx";

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

const metricIcons = {
  building: buildingIcon,
  users: usersIcon,
  subtask: subtaskIcon,
  pie: pieIcon,
} as const;

const meetingDots = {
  "1": dot1,
  "2": dot2,
  "3": dot3,
  "4": dot4,
} as const;

const cardShadow = "shadow-[0_1px_1px_1px_rgba(198,198,198,0.2)]";
const columnClass = "grid-cols-1 xl:grid-cols-[minmax(0,2.07fr)_minmax(300px,1fr)]";
const graphWidth = 675.337;
const graphHeight = 217.462;
const restingGraphX = 306;
const chartRanges = ["Daily", "Weekly", "Monthly"] as const;
const meetingRanges = ["Today", "Tomorrow", "This Week"] as const;
const taskRanges = ["September", "October", "November"] as const;
const statusOptions: { label: string; tone: DashboardTaskStatus }[] = [
  { label: "InProgress", tone: "progress" },
  { label: "Review", tone: "review" },
];

const graphFill =
  "M5.79468 96.9219C15.2295 91.9157 19.9047 73.3379 30.6709 73.3379C46.2083 73.3379 94.9758 116.409 111.069 116.409C124.948 116.409 131.483 92.9438 151.747 92.9438C177.994 92.9438 185.247 21.9835 201.518 21.9835C219.703 21.9835 230.71 136.288 248.417 136.288C266.124 136.288 278.888 60.0851 296.273 60.0851C312.175 60.0851 328.337 97.0824 341.258 97.0824C362.793 97.0824 414.956 0.999969 428.356 0.999969C447.325 0.999969 449.413 60.0851 479.562 60.0851C505.405 60.0851 518.251 97.0824 532.204 97.0824C547.997 97.0824 592.025 34.684 608.227 34.684C625.7 34.684 644.153 66.8315 669.355 70.7412C672.084 71.1645 674.337 73.3677 674.337 76.1291V212.462C674.337 215.223 672.099 217.462 669.337 217.462L6 217.462C3.23853 217.462 1 215.223 1 212.462V103.152C1 100.39 3.35535 98.2162 5.79468 96.9219Z";
const graphStroke =
  "M1 98.152C13.9212 98.152 18.2283 73.3379 30.6709 73.3379C46.2083 73.3379 94.9758 116.409 111.069 116.409C124.948 116.409 131.483 92.9438 151.747 92.9438C177.994 92.9438 185.247 21.9835 201.518 21.9835C219.703 21.9835 230.71 136.288 248.417 136.288C266.124 136.288 278.888 60.0852 296.273 60.0852C312.175 60.0852 328.337 97.0824 341.258 97.0824C362.793 97.0824 414.956 1 428.356 1C447.325 1 449.413 60.0852 479.562 60.0852C505.405 60.0852 518.251 97.0824 532.204 97.0824C547.997 97.0824 592.025 34.6841 608.227 34.6841C626.831 34.6841 646.546 71.1291 674.337 71.1291";

function pointAtX(path: SVGPathElement, x: number) {
  let low = 0;
  let high = path.getTotalLength();
  for (let step = 0; step < 24; step += 1) {
    const mid = (low + high) / 2;
    if (path.getPointAtLength(mid).x < x) low = mid;
    else high = mid;
  }
  return path.getPointAtLength((low + high) / 2);
}

const statusStyles = {
  progress: { background: "#fffaed", color: "#e9aa02", blink: blinkGold },
  review: { background: "#f6dfff", color: "#8e24aa", blink: blinkPurple },
} as const;

const priorityStyles = {
  high: "#cc4039",
  medium: "#03c95a",
  low: "#9856a4",
} as const;

export function AppHeader() {
  const dashboard = useDashboard();
  const profile = dashboard.data?.profile;
  const placeholder = dashboard.data?.searchPlaceholder ?? "Search anything here...";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center gap-2 border-b border-[#e2e4e9] bg-white px-3 sm:h-20 sm:gap-3 sm:px-[17px]">
      <SidebarTrigger className="-ml-1 cursor-pointer text-[#35383d]" />
      <form
        className="min-w-0 flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          const query = new FormData(event.currentTarget).get("query");
          logAction("Search", query);
        }}
      >
        <label className="relative block h-10 w-full max-w-[420px] sm:h-[46px]">
          <img
            alt=""
            src={searchIcon}
            className="pointer-events-none absolute top-1/2 left-[29px] size-4 -translate-y-1/2"
          />
          <input
            name="query"
            type="search"
            placeholder={placeholder}
            className="h-full w-full rounded-[200px] bg-[#f8f9fa] pr-4 pl-[51px] text-[14px] leading-5 text-[#111827] outline-none placeholder:text-[#6b7280]"
          />
        </label>
      </form>
      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-[38px]">
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-10 cursor-pointer items-center justify-center rounded-[20px] bg-[#f8f9fa] p-2 hover:bg-[#eceef2]"
          onClick={() => logAction("Open notifications")}
        >
          <img alt="" src={bellIcon} className="size-6" />
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 sm:gap-[23px]"
          onClick={() => logAction("Open profile", profile)}
        >
          <span className="flex items-center gap-2.5">
            <img alt="" src={avatar} className="size-10 rounded-full object-cover" />
            <span className="hidden w-[84px] flex-col items-start gap-px text-left leading-5 sm:flex">
              <span className="w-full text-[16px] font-medium text-black">{profile?.name ?? ""}</span>
              <span className="w-full text-[14px] font-normal text-[#6b7280]">{profile?.role ?? ""}</span>
            </span>
          </span>
          <img alt="" src={chevronIcon} className="hidden size-5 sm:block" />
        </button>
      </div>
    </header>
  );
}

export function DashboardView({ data }: { data: DashboardResponse }) {
  const [rows, setRows] = useState(data.tasks.rows);
  const [todos, setTodos] = useState(data.todos.items);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [modal, setModal] = useState<DashboardModal | null>(null);

  return (
    <div className="min-h-full">
      <div className="w-full px-4 pt-[11px] pb-6 sm:px-6">
        <div className="flex w-full flex-col">
          <WelcomeBanner welcome={data.welcome} onCreateTask={() => setModal("task")} onAddMember={() => setModal("member")} />
          <div className="mt-[10px] grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
          <div className={`mt-[9px] grid gap-[15px] ${columnClass}`}>
            <PerformanceChart chart={data.chart} />
            <MeetingsCard meetings={data.meetings} />
          </div>
          <div className={`mt-3 grid items-start gap-[15px] ${columnClass}`}>
            <TasksCard
              tasks={data.tasks}
              rows={rows}
              hoveredRow={hoveredRow}
              onHover={setHoveredRow}
              onStatus={(row, status) => {
                setRows((current) =>
                  current.map((item) => (item.id === row.id ? { ...item, status: status.label, statusTone: status.tone } : item)),
                );
                logAction("Change task status", { title: row.title, status: status.label });
              }}
            />
            <TodoCard
              todos={data.todos}
              items={todos}
              onToggle={(item) => {
                const done = !item.done;
                setTodos((current) =>
                  current.map((todo) => (todo.id === item.id ? { ...todo, done, highlighted: done } : todo)),
                );
                logAction(done ? "Check task" : "Uncheck task", item.title);
              }}
              onStar={(item) => {
                const starred = !item.starred;
                setTodos((current) => current.map((todo) => (todo.id === item.id ? { ...todo, starred } : todo)));
                logAction(starred ? "Star task" : "Unstar task", item.title);
              }}
              onAdd={() => {
                const item = {
                  id: `todo-${Date.now()}`,
                  title: "New task",
                  done: false,
                  starred: false,
                  highlighted: false,
                };
                setTodos((current) => [item, ...current]);
                logAction("Add task", item.title);
              }}
            />
          </div>
        </div>
      </div>
      <DashboardModals modal={modal} onChange={setModal} onClose={() => setModal(null)} />
    </div>
  );
}

function WelcomeBanner({
  welcome,
  onCreateTask,
  onAddMember,
}: {
  welcome: DashboardResponse["welcome"];
  onCreateTask: () => void;
  onAddMember: () => void;
}) {
  return (
    <section className="relative flex w-full flex-col items-start gap-4 overflow-hidden rounded-[5px] bg-gradient-to-r from-[#ff6f28] to-[#ff541f] p-6 sm:flex-row sm:items-center sm:p-10">
      <img alt="" src={bannerOrb} className="pointer-events-none absolute top-[-38px] left-[-38px] size-[111px] object-cover opacity-20" />
      <img
        alt=""
        src={bannerGlow}
        className="pointer-events-none absolute top-[-45px] right-[21px] h-[184px] w-[142px] rotate-[-19deg] object-cover"
      />
      <img
        alt=""
        src={diamond}
        className="pointer-events-none absolute top-[58px] left-[377px] hidden size-[81px] rotate-[-14deg] object-cover sm:block"
      />
      <img
        alt=""
        src={bannerOrb}
        className="pointer-events-none absolute top-[70px] right-[-62px] size-[274px] object-cover opacity-60"
      />
      <div className="relative flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-[24px] leading-8 font-bold text-white sm:text-[32px]">{welcome.title}</h1>
        <p className="text-[16px] leading-6 font-normal text-[#f8f9fa]">{welcome.subtitle}</p>
      </div>
      <div className="relative flex shrink-0 flex-wrap gap-2.5">
        <button
          type="button"
          className="cursor-pointer rounded-[5px] bg-black px-4 py-2 text-[13px] leading-4 font-medium text-white hover:bg-[#1a1a1a]"
          onClick={onCreateTask}
        >
          {welcome.primaryAction}
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-[5px] bg-[#f8f9fa] px-4 py-2 text-[13px] leading-4 font-medium text-[#111827] hover:bg-[#eceef2]"
          onClick={onAddMember}
        >
          {welcome.secondaryAction}
        </button>
      </div>
    </section>
  );
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className="flex h-[100px] min-w-0 items-center rounded-[5px] border border-[#f2f3f5] bg-white px-4 py-5">
      <div className="flex w-full items-center gap-3">
        <span className="flex shrink-0 items-center rounded-[5px] bg-[#212529] p-2.5">
          <img alt="" src={metricIcons[metric.icon]} className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
          <div className="min-w-0">
            <p
              className="leading-8 font-bold text-[#111827]"
              style={{ fontSize: metric.valueSize }}
            >
              {metric.value}
            </p>
            <p className="text-[13px] leading-4 font-normal text-[#6b7280]">{metric.label}</p>
          </div>
          <span
            className="shrink-0 rounded-[5px] p-1 text-[12px] leading-4 font-normal text-white"
            style={{ backgroundColor: metric.tone === "up" ? "#03c95a" : "#e70d0d" }}
          >
            {metric.change}
          </span>
        </div>
      </div>
    </article>
  );
}

function PerformanceChart({ chart }: { chart: DashboardResponse["chart"] }) {
  const gradientId = useId().replace(/:/g, "");
  const pathRef = useRef<SVGPathElement>(null);
  const [range, setRange] = useState(chart.range);
  const [point, setPoint] = useState({ x: restingGraphX, y: 60 });

  const moveTo = (x: number) => {
    const path = pathRef.current;
    if (!path) return;
    const next = pointAtX(path, Math.min(graphWidth - 1, Math.max(1, x)));
    setPoint({ x: next.x, y: next.y });
  };

  useEffect(() => {
    moveTo(restingGraphX);
    // The path is mounted with the chart, so one read places the resting marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percent = Math.max(0, Math.min(100, Math.round((1 - point.y / graphHeight) * 100)));
  const left = (point.x / graphWidth) * 100;
  const top = (point.y / graphHeight) * 100;

  return (
    <section className="flex h-[402px] min-w-0 flex-col rounded-[5px] border border-[#f2f3f5] bg-white">
      <div className="flex items-center justify-between px-[23px] pt-6">
        <h2 className="text-[16px] leading-[1.4] font-bold tracking-[0.2px] text-[#111827]">{chart.title}</h2>
        <OptionMenu
          options={chartRanges}
          value={range}
          onSelect={(value) => {
            setRange(value);
            logAction("Change chart range", value);
          }}
          className="flex h-[35px] cursor-pointer items-center gap-1 rounded-[5px] border border-[#e8e8e8] bg-white p-2 font-[Inter,sans-serif] text-[12px] leading-[1.6] text-[#35383d] hover:bg-[#f8f9fa]"
        >
          {range}
          <img alt="" src={chevronChart} className="size-4" />
        </OptionMenu>
      </div>
      <div className="flex min-h-0 flex-1 px-[23px] pt-4 pb-2">
        <div className="flex w-8 shrink-0 flex-col items-end justify-between pr-2 font-[Inter,sans-serif] text-[12px] leading-[1.6] text-[#35383d]">
          {chart.yTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div
          className="relative min-w-0 flex-1 cursor-crosshair"
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            moveTo(((event.clientX - bounds.left) / bounds.width) * graphWidth);
          }}
          onPointerLeave={() => moveTo(restingGraphX)}
        >
          <img alt="" src={grid} className="pointer-events-none absolute inset-0 h-full w-full" />
          <svg
            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path d={graphFill} fill={`url(#${gradientId})`} />
            <path ref={pathRef} d={graphStroke} fill="none" stroke="#FF541F" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id={gradientId} x1="337.669" y1="217.462" x2="337.669" y2="-181.225" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF541F" stopOpacity="0" />
                <stop offset="1" stopColor="#FF541F" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
          <div
            className="pointer-events-none absolute top-0 h-full border-l border-dashed border-[#cbd5e1]"
            style={{ left: `${left}%` }}
          />
          <div
            className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_8px_rgba(37,99,235,0.14)]"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span className="absolute inset-[4px] rounded-full bg-[#ff541f]" />
          </div>
          <div
            className="pointer-events-none absolute z-10 flex h-[61px] w-[86px] flex-col items-center justify-center gap-1 rounded-[5px] border border-[#ff541f] bg-[#ff541f] px-3 py-2 font-[Inter,sans-serif] leading-[1.6] text-white shadow-[0_20px_20px_rgba(15,23,42,0.15)]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: left > 78 ? "translate(calc(-100% - 16px), -50%)" : "translate(16px, -50%)",
            }}
          >
            <p className="text-[10px] font-medium whitespace-nowrap">{chart.tooltipLabel}</p>
            <p className="text-[12px] font-bold whitespace-nowrap">{percent}%</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between pr-[23px] pb-4 pl-[55px] font-[Inter,sans-serif] text-[12px] leading-[1.6] text-[#35383d]">
        {chart.xTicks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </section>
  );
}

function RangeChip({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  onSelect: (value: string) => void;
}) {
  const [value, setValue] = useState(label);

  return (
    <OptionMenu
      options={options}
      value={value}
      onSelect={(next) => {
        setValue(next);
        onSelect(next);
      }}
      className="flex cursor-pointer items-center gap-1 rounded-[5px] border border-[#e5e7eb] bg-white px-2 py-[7px] text-[12px] leading-4 font-normal whitespace-nowrap text-[#111827] hover:bg-[#f8f9fa]"
    >
      <img alt="" src={calendarIcon} className="size-3.5" />
      {value}
    </OptionMenu>
  );
}

function MeetingsCard({ meetings }: { meetings: DashboardResponse["meetings"] }) {
  return (
    <section className={`flex h-[402px] min-w-0 flex-col rounded-[5px] border border-[#f2f3f5] bg-white ${cardShadow}`}>
      <header className="flex items-center gap-2.5 border-b border-[#e5e7eb] px-5 py-[15px]">
        <h2 className="min-w-0 flex-1 text-[16px] leading-6 font-semibold text-[#111827]">{meetings.title}</h2>
        <RangeChip
          label={meetings.range}
          options={meetingRanges}
          onSelect={(value) => logAction("Change meetings range", value)}
        />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="relative">
          <div className="pointer-events-none absolute top-2 bottom-2 left-[74px] w-px overflow-hidden">
            <img
              alt=""
              src={timeline}
              className="absolute top-0 left-0 h-px w-[1000px] max-w-none origin-top-left rotate-90"
            />
          </div>
          <ul className="relative flex flex-col gap-6">
            {meetings.items.map((item) => (
              <MeetingRow key={item.id} item={item} joinLabel={meetings.joinLabel} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MeetingRow({ item, joinLabel }: { item: DashboardMeeting; joinLabel: string }) {
  return (
    <li className="flex items-center gap-4">
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-[12px] leading-6 font-normal whitespace-nowrap text-[#6b7280]">{item.time}</span>
        <img alt="" src={meetingDots[item.dot]} className="size-[8.6px]" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1.5 py-2 pl-2">
        <div className="min-w-0 flex-1 leading-6">
          <p className="text-[14px] font-medium text-[#111827]">{item.title}</p>
          <p className="text-[12px] font-normal text-[#6b7280]">{item.link}</p>
        </div>
        <button
          type="button"
          className="w-[42px] shrink-0 cursor-pointer rounded-[5px] bg-[#009ddc] p-1.5 text-[10px] leading-[8px] font-medium text-white hover:bg-[#0089c2]"
          onClick={() => logAction("Join meeting", { title: item.title, link: item.link })}
        >
          {joinLabel}
        </button>
      </div>
    </li>
  );
}

function TasksCard({
  tasks,
  rows,
  hoveredRow,
  onHover,
  onStatus,
}: {
  tasks: DashboardResponse["tasks"];
  rows: DashboardTask[];
  hoveredRow: string | null;
  onHover: (id: string | null) => void;
  onStatus: (row: DashboardTask, status: { label: string; tone: DashboardTaskStatus }) => void;
}) {
  const cell = (id: string) =>
    `flex h-14 items-center border-b border-[#f8f9fa] px-5 py-2 ${hoveredRow === id ? "bg-[#f4f5f7]" : "bg-white"}`;

  return (
    <section className={`min-w-0 rounded-[5px] bg-white ${cardShadow}`}>
      <header className="flex items-center gap-2.5 border-b border-[#e5e7eb] px-5 py-[15px]">
        <h2 className="min-w-0 flex-1 text-[16px] leading-6 font-semibold text-[#111827]">{tasks.title}</h2>
        <RangeChip
          label={tasks.range}
          options={taskRanges}
          onSelect={(value) => logAction("Change tasks range", value)}
        />
      </header>
      <div className="overflow-x-auto">
      <div className="grid min-w-[760px] grid-cols-[minmax(180px,1.8fr)_140px_168px_130px_120px]">
        <ColumnHeading label={tasks.columns.title} />
        <ColumnHeading label={tasks.columns.assignee} />
        <ColumnHeading label={tasks.columns.status} />
        <ColumnHeading label={tasks.columns.deadline} />
        <ColumnHeading label={tasks.columns.priority} />
        {rows.map((row) => (
          <div
            key={row.id}
            className="col-span-5 grid grid-cols-subgrid"
            onMouseEnter={() => onHover(row.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className={cell(row.id)}>
              <p className="truncate text-[14px] leading-6 font-medium text-[#111827]">{row.title}</p>
            </div>
            <div className={cell(row.id)}>
              <FaceStack faces={row.faces} extra={row.extra} />
            </div>
            <div className={`${cell(row.id)} px-4`}>
              <StatusMenu row={row} onStatus={(status) => onStatus(row, status)} />
            </div>
            <div className={cell(row.id)}>
              <p className="text-[14px] leading-6 font-normal text-[#6b7280]">{row.deadline}</p>
            </div>
            <div className={cell(row.id)}>
              <span
                className="flex h-5 items-center justify-center gap-[5px] rounded-[5px] p-1.5 text-[10px] leading-[8px] font-medium text-white"
                style={{ backgroundColor: priorityStyles[row.priorityTone] }}
              >
                <img alt="" src={priorityDot} className="size-[5px]" />
                {row.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

function ColumnHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center bg-[#f8f9fa] px-5 py-1.5">
      <p className="text-[14px] leading-6 font-semibold whitespace-nowrap text-[#111827]">{label}</p>
    </div>
  );
}

function FaceStack({ faces: ids, extra }: { faces: string[]; extra: number | null }) {
  return (
    <div className="flex items-start">
      {ids.map((id, index) => (
        <img
          key={`${id}-${index}`}
          alt=""
          src={faces[id]}
          className="size-6 rounded-full border border-white object-cover"
          style={{ marginRight: index === ids.length - 1 && extra === null ? 0 : -10 }}
        />
      ))}
      {extra !== null ? (
        <span className="flex size-6 items-center justify-center rounded-full bg-[#ff541f] text-[10px] leading-[8px] font-medium text-white">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

function StatusMenu({
  row,
  onStatus,
}: {
  row: DashboardTask;
  onStatus: (status: { label: string; tone: DashboardTaskStatus }) => void;
}) {
  const tone = statusStyles[row.statusTone];

  return (
    <OptionMenu
      options={statusOptions.map((option) => option.label)}
      value={row.status}
      onSelect={(label) => {
        const status = statusOptions.find((option) => option.label === label);
        if (status) onStatus(status);
      }}
      className="flex h-[22px] cursor-pointer items-center gap-2.5"
    >
      <span
        className="flex w-[82px] items-center justify-center gap-1 rounded-[5px] p-1"
        style={{ backgroundColor: tone.background, color: tone.color }}
      >
        <img alt="" src={tone.blink} className="size-[9px]" />
        <span className="text-[12px] leading-4 font-medium">{row.status}</span>
      </span>
      <img alt="" src={chevronSm} className="size-3" />
    </OptionMenu>
  );
}

function TodoCard({
  todos,
  items,
  onToggle,
  onStar,
  onAdd,
}: {
  todos: DashboardResponse["todos"];
  items: DashboardTodo[];
  onToggle: (item: DashboardTodo) => void;
  onStar: (item: DashboardTodo) => void;
  onAdd: () => void;
}) {
  return (
    <section className={`min-w-0 rounded-[5px] bg-white ${cardShadow}`}>
      <header className="flex items-center gap-2.5 rounded-t-[5px] border-b border-[#e5e7eb] px-5 py-[15px]">
        <h2 className="min-w-0 flex-1 text-[16px] leading-6 font-semibold text-[#111827]">{todos.title}</h2>
        <RangeChip
          label={todos.range}
          options={meetingRanges}
          onSelect={(value) => logAction("Change task list range", value)}
        />
        <button
          type="button"
          aria-label="Add task"
          className="flex cursor-pointer items-center rounded-[40px] bg-[#f26522] p-1 hover:bg-[#e45512]"
          onClick={onAdd}
        >
          <img alt="" src={addIcon} className="size-4" />
        </button>
      </header>
      <ul className="flex flex-col gap-2 p-5">
        {items.map((item) => (
          <TodoRow key={item.id} item={item} onToggle={onToggle} onStar={onStar} />
        ))}
      </ul>
    </section>
  );
}

function TodoRow({
  item,
  onToggle,
  onStar,
}: {
  item: DashboardTodo;
  onToggle: (item: DashboardTodo) => void;
  onStar: (item: DashboardTodo) => void;
}) {
  return (
    <li
      className="flex items-center gap-2 rounded-[5px] border border-[#e5e7eb] p-2 hover:border-[#d5d8de]"
      style={{ backgroundColor: item.highlighted ? "#fef1eb" : "#ffffff" }}
    >
      <button
        type="button"
        aria-pressed={item.done}
        aria-label={item.done ? `Uncheck ${item.title}` : `Check ${item.title}`}
        className="relative size-4 shrink-0 cursor-pointer rounded-[5px] border"
        style={{
          backgroundColor: item.done ? "#ff541f" : "#ffffff",
          borderColor: item.done ? "#ff541f" : "#e5e7eb",
        }}
        onClick={() => onToggle(item)}
      >
        {item.done ? <img alt="" src={checkIcon} className="absolute top-[3px] left-[3px] size-2.5" /> : null}
      </button>
      <button
        type="button"
        aria-pressed={item.starred}
        aria-label={item.starred ? `Unstar ${item.title}` : `Star ${item.title}`}
        className="cursor-pointer"
        onClick={() => onStar(item)}
      >
        <img alt="" src={item.starred ? starFilled : starIcon} className="size-3.5" />
      </button>
      <span className="text-[14px] leading-6 font-medium whitespace-pre text-[#111827]">{item.title}</span>
    </li>
  );
}
