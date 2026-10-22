/**
 * Response contracts shared by the mock JSON files and the future backend.
 * Real GET endpoints should return these same bodies.
 * Static JSON cannot accept writes. Logout in mock mode only clears client state.
 */

export const sectionIds = [
  "dashboard",
  "meetings",
  "tasks",
  "projects",
  "team",
  "integration",
  "report",
  "settings",
  "account",
] as const;

export type SectionId = (typeof sectionIds)[number];

export type NavItem = {
  id: SectionId;
  label: string;
};

export type NavigationResponse = {
  brand: string;
  items: NavItem[];
  footer: {
    id: "logout";
    label: string;
  };
};

export type Metric = {
  id: string;
  label: string;
  value: string;
};

export type DashboardMetricIcon = "building" | "users" | "subtask" | "pie";
export type DashboardMetricTone = "up" | "down";
export type DashboardTaskStatus = "progress" | "review";
export type DashboardTaskPriority = "high" | "medium" | "low";

export type DashboardMetric = {
  id: string;
  icon: DashboardMetricIcon;
  value: string;
  label: string;
  change: string;
  tone: DashboardMetricTone;
  valueSize: 20 | 24;
};

export type DashboardMeeting = {
  id: string;
  time: string;
  title: string;
  link: string;
  dot: "1" | "2" | "3" | "4";
};

export type DashboardTask = {
  id: string;
  title: string;
  faces: string[];
  extra: number | null;
  status: string;
  statusTone: DashboardTaskStatus;
  deadline: string;
  priority: string;
  priorityTone: DashboardTaskPriority;
};

export type DashboardTodo = {
  id: string;
  title: string;
  done: boolean;
  starred: boolean;
  highlighted: boolean;
};

export type DashboardResponse = {
  profile: {
    name: string;
    role: string;
  };
  searchPlaceholder: string;
  welcome: {
    title: string;
    subtitle: string;
    primaryAction: string;
    secondaryAction: string;
  };
  metrics: DashboardMetric[];
  chart: {
    title: string;
    range: string;
    tooltipLabel: string;
    tooltipValue: string;
    yTicks: string[];
    xTicks: string[];
  };
  meetings: {
    title: string;
    range: string;
    joinLabel: string;
    items: DashboardMeeting[];
  };
  tasks: {
    title: string;
    range: string;
    columns: {
      title: string;
      assignee: string;
      status: string;
      deadline: string;
      priority: string;
    };
    rows: DashboardTask[];
  };
  todos: {
    title: string;
    range: string;
    items: DashboardTodo[];
  };
};

export type UserStatus = "active" | "invited" | "suspended";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
};

export type UsersResponse = {
  title: string;
  users: UserRecord[];
};

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type OrderRecord = {
  id: string;
  reference: string;
  customer: string;
  status: OrderStatus;
  total: string;
  placedAt: string;
};

export type OrdersResponse = {
  title: string;
  orders: OrderRecord[];
};

export type MeetingStatus = "done" | "upcoming";

export type MeetingRecord = {
  id: string;
  title: string;
  emphasis: boolean;
  source: string;
  ownerInitials: string;
  ownerName: string;
  status: MeetingStatus;
  date: string;
  selected: boolean;
};

export type MeetingAttendee = {
  name: string;
  avatar: "lewis" | "leona" | "pineiro" | "moseley";
};

export type MeetingTranscriptLine = {
  name: string;
  time: string;
  text: string;
};

export type MeetingTaskStatus = "completed" | "inprogress";

export type MeetingTaskItem = {
  id: string;
  title: string;
  starred: boolean;
  done: boolean;
  status: MeetingTaskStatus;
};

export type MeetingQuestion = {
  name: string;
  text: string;
};

export type MeetingAttendance = {
  name: string;
  joined: string;
  spent: string;
  left: string;
};

export type MeetingDetail = {
  backLabel: string;
  link: string;
  owner: string;
  date: string;
  time: string;
  duration: string;
  attendees: MeetingAttendee[];
  moreLabel: string;
  overviewTitle: string;
  overview: string[];
  keyPointsTitle: string;
  keyPoints: string[];
  transcript: MeetingTranscriptLine[];
  tasksTitle: string;
  tasks: MeetingTaskItem[];
  questionsTitle: string;
  questions: MeetingQuestion[];
  attendance: MeetingAttendance[];
};

export type MeetingsResponse = {
  title: string;
  recordLabel: string;
  listTitle: string;
  listSubtitle: string;
  summary: string;
  page: number;
  pages: number[];
  lastPage: number;
  detail: MeetingDetail;
  meetings: MeetingRecord[];
};

export type TaskPriority = "high" | "medium" | "low";
export type TaskWorkflowStatus = "todo" | "in_progress" | "review" | "done";
export type TaskKind = "recurring" | "one_time";
export type TaskTag = "ux_design" | "frontend" | "backend" | "qa" | "mobile";
export type TaskPerson = "lewis" | "leona" | "pineiro" | "moseley";
export type TaskFileKind = "doc" | "pdf" | "zip";

export type TaskRecord = {
  id: string;
  title: string;
  emphasis: boolean;
  assignees: TaskPerson[];
  extraAssignees: number;
  kind: TaskKind;
  priority: TaskPriority;
  status: TaskWorkflowStatus;
  due: string;
  tag: TaskTag;
  selected: boolean;
};

export type TaskFile = {
  id: string;
  name: string;
  size: string;
  addedAt: string;
  owner: TaskPerson;
  kind: TaskFileKind;
};

export type TaskAssigneeChip = {
  id: TaskPerson;
  name: string;
};

export type TaskDetail = {
  backLabel: string;
  editLabel: string;
  assignees: TaskAssigneeChip[];
  addAssigneeLabel: string;
  descriptionTitle: string;
  description: string;
  filesTitle: string;
  addFileLabel: string;
  files: TaskFile[];
};

export type TasksResponse = {
  title: string;
  createLabel: string;
  listTitle: string;
  listSubtitle: string;
  summary: string;
  page: number;
  pages: number[];
  lastPage: number;
  detail: TaskDetail;
  tasks: TaskRecord[];
};

export type ProjectCardStatus = "inprogress" | "completed";
export type ProjectLogo = "databricks" | "outreach";

export type ProjectRecord = {
  id: string;
  name: string;
  logo: ProjectLogo;
  tasks: number;
  completed: number;
  status: ProjectCardStatus;
  duration: string;
  deadline: string;
  lead: string;
  progress: number;
  comments: number;
  subtasks: number;
  updated: string;
};

export type ProjectPerson = {
  id: string;
  name: string;
};

export type ProjectTaskItem = {
  id: string;
  title: string;
  done: boolean;
  starred: boolean;
  status: ProjectCardStatus;
  faces: number;
};

export type ProjectFile = {
  id: string;
  name: string;
  size: string;
  addedAt: string;
  owner: string;
  kind: "doc" | "pdf" | "zip";
};

export type ProjectDetail = {
  backLabel: string;
  editLabel: string;
  durationLabel: string;
  team: ProjectPerson[];
  leads: ProjectPerson[];
  manager: ProjectPerson;
  labels: { text: string; tone: "pink" | "blue" }[];
  descriptionTitle: string;
  description: string;
  tasksTitle: string;
  newTaskLabel: string;
  tasks: ProjectTaskItem[];
  filesTitle: string;
  addFileLabel: string;
  files: ProjectFile[];
};

export type ProjectForm = {
  title: string;
  saveLabel: string;
  projectLabel: string;
  projectName: string;
  labelLabel: string;
  labels: string[];
  teamLabel: string;
  team: ProjectPerson[];
  leadLabel: string;
  lead: ProjectPerson;
  managerLabel: string;
  manager: ProjectPerson;
  deadlineLabel: string;
  deadline: string;
  descriptionLabel: string;
  description: string;
  filesLabel: string;
  fileName: string;
  fileSize: string;
};

export type ProjectsResponse = {
  title: string;
  createLabel: string;
  listTitle: string;
  listSubtitle: string;
  detail: ProjectDetail;
  form: ProjectForm;
  projects: ProjectRecord[];
};

export type IntegrationIcon =
  | "google"
  | "slack"
  | "drive"
  | "docs"
  | "notion"
  | "meta"
  | "teams"
  | "gmail"
  | "sheets"
  | "salesforce"
  | "dropbox"
  | "hubspot"
  | "amazon"
  | "trello"
  | "calendar"
  | "chatgpt";

export type IntegrationRecord = {
  id: string;
  name: string;
  icon: IntegrationIcon;
  connected: boolean;
  description: string;
  enables: string[];
};

export type IntegrationsResponse = {
  title: string;
  listTitle: string;
  listSubtitle: string;
  summary: string;
  page: number;
  pages: number[];
  lastPage: number;
  enablesTitle: string;
  footnote: string;
  connectLabel: string;
  cancelLabel: string;
  integrations: IntegrationRecord[];
};

export type ReportMetricTone = "pink" | "purple" | "green" | "red";

export type ReportMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down";
  tone: ReportMetricTone;
  fill: number;
};

export type ReportPriority = "high" | "low" | "medium";

export type ReportProject = {
  id: string;
  code: string;
  name: string;
  team: string[];
  extra: string | null;
  hours: string;
  hoursFill: number;
  deadline: string;
  priority: ReportPriority;
};

export type ReportPerformerTone = "orange" | "green" | "purple" | "blue" | "navy";

export type ReportPerformer = {
  id: string;
  name: string;
  role: string;
  score: string;
  tone: ReportPerformerTone;
};

export type ReportTaskStat = {
  id: string;
  label: string;
  value: string;
};

export type ReportDepartment = {
  name: string;
  value: number;
};

export type ReportResponse = {
  title: string;
  exportLabel: string;
  rangeLabel: string;
  ranges: string[];
  metrics: ReportMetric[];
  attendance: {
    title: string;
    value: string;
    change: string;
    comparison: string;
    days: string[];
  };
  tasks: {
    title: string;
    totalLabel: string;
    total: string;
    stats: ReportTaskStat[];
  };
  departments: {
    title: string;
    scale: string[];
    items: ReportDepartment[];
    footnote: string;
    footnoteValue: string;
    footnoteTrail: string;
  };
  projectsTitle: string;
  projects: ReportProject[];
  page: number;
  pages: number[];
  lastPage: number;
  performersTitle: string;
  performers: ReportPerformer[];
};

export type SettingsSectionId = "company" | "subscription" | "calendar" | "report";

export type SettingsNavItem = {
  id: SettingsSectionId;
  label: string;
};

export type SettingsConsent = {
  id: string;
  label: string;
  enabled: boolean;
};

export type SettingsResponse = {
  title: string;
  updateLabel: string;
  nav: SettingsNavItem[];
  company: {
    title: string;
    nameLabel: string;
    name: string;
    nameHint: string;
    emailLabel: string;
    email: string;
    emailHintLead: string;
    emailHintLink: string;
    emailHintTrail: string;
    timezoneLabel: string;
    timezone: string;
    timezones: string[];
    timezoneHint: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    locationLabel: string;
    location: string;
  };
  subscription: {
    title: string;
    overview: string;
    cancelLabel: string;
    upgradeLabel: string;
    usersLabel: string;
    usersValue: string;
    remaining: string;
    activeTitle: string;
    activeDetail: string;
    priceTitle: string;
    priceDetail: string;
    alertTitle: string;
    alertLead: string;
    alertLink: string;
    alertTrail: string;
  };
  calendar: {
    title: string;
    autoJoinTitle: string;
    autoJoinDetail: string;
    autoJoin: boolean;
    consentTitle: string;
    consentDetail: string;
    options: SettingsConsent[];
  };
  report: {
    title: string;
    weeklyLabel: string;
    enabled: boolean;
    frequency: string;
    frequencies: string[];
    hint: string;
  };
};

export type AccountSectionId = "profile" | "password" | "notification" | "logout";

export type AccountField = {
  label: string;
  value: string;
};

export type AccountResponse = {
  title: string;
  editLabel: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  nav: { id: AccountSectionId; label: string }[];
  personalTitle: string;
  professionalTitle: string;
  personal: AccountField[];
  professional: AccountField[];
};

export type SessionResponse = {
  token: string | null;
  name: string;
  email: string;
};
