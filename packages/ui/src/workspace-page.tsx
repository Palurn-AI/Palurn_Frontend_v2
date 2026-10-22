import {
  getErrorMessage,
  sectionIds,
  useAccount,
  useDashboard,
  useIntegrations,
  useLogout,
  useMeetings,
  useNavigation,
  useProjects,
  useReport,
  useSettings,
  useTasks,
  useUiStore,
  type SectionId,
} from "@palurn/api";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router";

import { AppSidebar, type SidebarItem } from "./components/app-sidebar.tsx";
import { AppHeader, DashboardView } from "./dashboard-view.tsx";
import { MeetingDetailView } from "./meeting-detail-view.tsx";
import { IntegrationsView } from "./integrations-view.tsx";
import { MeetingsView } from "./meetings-view.tsx";
import { ProjectDetailView } from "./project-detail-view.tsx";
import { ProjectsView } from "./projects-view.tsx";
import { ReportView } from "./report-view.tsx";
import { AccountView } from "./account-view.tsx";
import { SettingsView } from "./settings-view.tsx";
import { TaskDetailView } from "./task-detail-view.tsx";
import { TasksView } from "./tasks-view.tsx";
import { TeamDetailView } from "./team-detail-view.tsx";
import { teamMembers } from "./team-data.ts";
import { TeamView } from "./team-view.tsx";
import { PageSkeleton } from "./page-skeletons.tsx";

const WorkspaceSections = createContext<readonly SectionId[] | null>(null);

export function WorkspacePage({ sections }: { sections?: readonly SectionId[] }) {
  return (
    <WorkspaceSections.Provider value={sections ?? null}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/meetings/:meetingId" element={<WorkspaceShell />} />
        <Route path="/tasks/:taskId" element={<WorkspaceShell />} />
        <Route path="/projects/:projectId" element={<WorkspaceShell />} />
        <Route path="/team/:memberId" element={<WorkspaceShell />} />
        <Route path="/:section" element={<WorkspaceShell />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </WorkspaceSections.Provider>
  );
}

function WorkspaceShell() {
  const allowed = useContext(WorkspaceSections);
  const { section: sectionParam, meetingId, taskId, projectId, memberId } = useParams();
  const navigation = useNavigation();
  const setActiveSection = useUiStore((state) => state.setActiveSection);
  const logout = useLogout();
  const section = isSectionId(sectionParam) ? sectionParam : meetingId ? "meetings" : taskId ? "tasks" : projectId ? "projects" : memberId ? "team" : null;

  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section, setActiveSection]);

  if (!section) {
    return <Navigate to="/dashboard" replace />;
  }

  const items: SidebarItem[] = navigation.data?.items ?? [];
  const showPage = !allowed || allowed.includes(section);

  return (
    <AppSidebar
      brand={navigation.data?.brand}
      items={items}
      footer={navigation.data?.footer}
      activeId={section}
      onLogout={() => logout.mutate()}
    >
      <section
        className={
          section === "dashboard"
            ? "min-h-0 flex-1 overflow-auto bg-[#f8f9fa] text-[#35383d]"
            : section === "settings"
              ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fafafa] text-[#35383d]"
              : section === "account"
                ? "min-h-0 flex-1 overflow-auto bg-[#f8f9fa] text-[#35383d]"
              : section === "meetings" || section === "tasks" || section === "projects" || section === "integration" || section === "report"
                ? "min-h-0 flex-1 overflow-auto bg-[#fafafa] text-[#35383d]"
                : "min-h-0 flex-1 overflow-auto bg-white text-[#35383d]"
        }
      >
        <AppHeader />
        {showPage && navigation.isError ? (
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <Status title="Navigation unavailable" message={getErrorMessage(navigation.error)} />
          </div>
        ) : null}
        {showPage ? (
          <div className={section === "settings" ? "flex min-h-0 flex-1 flex-col" : section === "dashboard" || section === "meetings" || section === "tasks" || section === "projects" || section === "team" || section === "integration" || section === "report" || section === "account" ? "min-h-full" : "px-4 py-6 sm:px-8 sm:py-8"}>
            {section === "meetings" && meetingId ? (
              <MeetingDetailSection meetingId={meetingId} />
            ) : section === "tasks" && taskId ? (
              <TaskDetailSection taskId={taskId} />
            ) : section === "projects" && projectId ? (
              <ProjectDetailSection projectId={projectId} />
            ) : section === "team" && memberId ? (
              <TeamDetailSection memberId={memberId} />
            ) : (
              <ActiveSection section={section} />
            )}
          </div>
        ) : null}
      </section>
    </AppSidebar>
  );
}

function ActiveSection({ section }: { section: SectionId }) {
  switch (section) {
    case "dashboard":
      return <DashboardSection />;
    case "meetings":
      return <MeetingsSection />;
    case "tasks":
      return <TasksSection />;
    case "projects":
      return <ProjectsSection />;
    case "team":
      return <TeamView />;
    case "integration":
      return <IntegrationsSection />;
    case "report":
      return <ReportSection />;
    case "settings":
      return <SettingsSection />;
    case "account":
      return <AccountSection />;
  }
}

function DashboardSection() {
  const dashboard = useDashboard();

  return (
    <QueryBody query={dashboard} skeleton={<PageSkeleton section="dashboard" />}>
      {(data) => <DashboardView data={data} />}
    </QueryBody>
  );
}

function MeetingDetailSection({ meetingId }: { meetingId: string }) {
  const meetings = useMeetings();

  return (
    <QueryBody query={meetings} skeleton={<PageSkeleton section="meetings" detail />}>
      {(data) => {
        const meeting = data.meetings.find((item) => item.id === meetingId);
        if (!meeting) {
          return <Status title="Meeting unavailable" message="This meeting could not be found." />;
        }
        return <MeetingDetailView meeting={meeting} detail={data.detail} />;
      }}
    </QueryBody>
  );
}

function MeetingsSection() {
  const meetings = useMeetings();

  return (
    <QueryBody query={meetings} skeleton={<PageSkeleton section="meetings" />}>
      {(data) => <MeetingsView data={data} />}
    </QueryBody>
  );
}

function TaskDetailSection({ taskId }: { taskId: string }) {
  const tasks = useTasks();

  return (
    <QueryBody query={tasks} skeleton={<PageSkeleton section="tasks" detail />}>
      {(data) => {
        const task = data.tasks.find((item) => item.id === taskId);
        if (!task) {
          return <Status title="Task unavailable" message="This task could not be found." />;
        }
        return <TaskDetailView task={task} detail={data.detail} />;
      }}
    </QueryBody>
  );
}

function TasksSection() {
  const tasks = useTasks();

  return (
    <QueryBody query={tasks} skeleton={<PageSkeleton section="tasks" />}>
      {(data) => <TasksView data={data} />}
    </QueryBody>
  );
}

function ProjectDetailSection({ projectId }: { projectId: string }) {
  const projects = useProjects();

  return (
    <QueryBody query={projects} skeleton={<PageSkeleton section="projects" detail />}>
      {(data) => {
        const project = data.projects.find((item) => item.id === projectId);
        if (!project) {
          return <Status title="Project unavailable" message="This project could not be found." />;
        }
        return <ProjectDetailView project={project} detail={data.detail} />;
      }}
    </QueryBody>
  );
}

function ProjectsSection() {
  const projects = useProjects();

  return (
    <QueryBody query={projects} skeleton={<PageSkeleton section="projects" />}>
      {(data) => <ProjectsView data={data} />}
    </QueryBody>
  );
}

function TeamDetailSection({ memberId }: { memberId: string }) {
  const member = teamMembers.find((item) => item.id === memberId);
  if (!member) {
    return <Status title="Teammate unavailable" message="This teammate could not be found." />;
  }
  return <TeamDetailView member={member} />;
}

function IntegrationsSection() {
  const integrations = useIntegrations();

  return (
    <QueryBody query={integrations} skeleton={<PageSkeleton section="integration" />}>
      {(data) => <IntegrationsView data={data} />}
    </QueryBody>
  );
}

function ReportSection() {
  const report = useReport();

  return (
    <QueryBody query={report} skeleton={<PageSkeleton section="report" />}>
      {(data) => <ReportView data={data} />}
    </QueryBody>
  );
}

function SettingsSection() {
  const settings = useSettings();

  return (
    <QueryBody query={settings} skeleton={<PageSkeleton section="settings" />}>
      {(data) => <SettingsView data={data} />}
    </QueryBody>
  );
}

function AccountSection() {
  const account = useAccount();
  const logout = useLogout();

  return (
    <QueryBody query={account} skeleton={<PageSkeleton section="account" />}>
      {(data) => <AccountView data={data} onLogout={() => logout.mutate()} />}
    </QueryBody>
  );
}

function QueryBody<T>({
  query,
  skeleton,
  children,
}: {
  query: {
    data: T | undefined;
    error: unknown;
    isError: boolean;
    isPending: boolean;
  };
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) {
    return skeleton;
  }

  if (query.isError) {
    return (
      <div className="px-6 py-8">
        <Status title="Could not load data" message={getErrorMessage(query.error)} />
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className="px-6 py-8">
        <Status title="Nothing to show" message="The response was empty." />
      </div>
    );
  }

  return children(query.data);
}

function Status({ title, message }: { title: string; message: string }) {
  return (
    <div>
      <h1 className="text-[20px] leading-normal font-medium text-[#241328]">{title}</h1>
      <p className="mt-2 text-base leading-6">{message}</p>
    </div>
  );
}

function isSectionId(id: string | undefined): id is SectionId {
  return sectionIds.some((sectionId) => sectionId === id);
}
