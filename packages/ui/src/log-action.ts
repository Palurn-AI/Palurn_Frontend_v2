import { toast } from "./components/toast.tsx";

const skip =
  /^(open |close |inspect |select |unselect |clear |sort |search$|edit profile$|change [\w ]+ page$|change [\w ]+ range$|meeting\.tab|meeting\.tasks\.toggle|toggle project tasks|toggle project files|toggle task files)/i;

const titles: Record<string, string> = {
  "Log out": "Logged out",
  "Log out from account": "Logged out",
  "Delete account": "Account deleted",
  "Save password": "Password updated",
  "Save profile": "Profile updated",
  "Change account image": "Image updated",
  "Remove account image": "Image removed",
  "Update profile": "Profile updated",
  "Change time zone": "Time zone updated",
  "Toggle auto-join meetings": "Calendar updated",
  "Toggle recording consent": "Recording preference updated",
  "Change report frequency": "Report settings updated",
  "Add payment method": "Payment method added",
  "Cancel subscription": "Subscription cancelled",
  "Change subscription": "Subscription updated",
  "Export report": "Report exported",
  "Disconnect integration": "Integration disconnected",
  "Connect integration": "Integration connected",
  "Export integrations": "Integrations exported",
  "Delete teammates": "Teammates removed",
  "Send teammate invite": "Invite sent",
  "Export teammates": "Team exported",
  "Copy teammate email": "Email copied",
  "Edit teammate profile": "Profile updated",
  "Save project": "Project created",
  "Export projects": "Projects exported",
  "Delete tasks": "Tasks deleted",
  "Export tasks": "Tasks exported",
  "Delete meetings": "Meetings deleted",
  "Export meetings": "Meetings exported",
  "Record meeting": "Recording started",
  "Add task": "Task added",
  "Check task": "Task completed",
  "Uncheck task": "Task updated",
  "Star task": "Task updated",
  "Unstar task": "Task updated",
  "Change task status": "Task updated",
  "Join meeting": "Joining meeting",
  "meeting.join": "Joining meeting",
  "meeting.task.toggle": "Task updated",
  "Delete task file": "File deleted",
  "Delete project file": "File deleted",
  "Download task file": "Download started",
  "Download project file": "Download started",
  "Add task file": "File added",
  "Add project file": "File added",
  "Change project status": "Project updated",
  "Edit project": "Project updated",
  "Edit task": "Task updated",
  "Add project team member": "Team member added",
  "Add team lead": "Team lead added",
  "Add project manager": "Project manager added",
  "Add task assignee": "Assignee added",
  "Add project task": "Task added",
  "Star project task": "Task updated",
  "Toggle project task": "Task updated",
};

export function notifySuccess(title: string) {
  toast.add({
    type: "success",
    title,
    timeout: 3200,
  });
}

export function logAction(action: string, detail?: unknown) {
  console.log(action, detail ?? "");
  if (skip.test(action)) return;
  notifySuccess(titles[action] ?? action);
}
