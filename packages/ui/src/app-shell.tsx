import "./app-shell.css";

export type AppShellProps = {
  title: string;
};

export function AppShell({ title }: AppShellProps) {
  return (
    <main className="app-shell">
      <h1>{title}</h1>
    </main>
  );
}
