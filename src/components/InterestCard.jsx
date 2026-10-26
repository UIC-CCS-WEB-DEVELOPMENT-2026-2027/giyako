import LogShowcase from "./LogShowcase";

// Your own profile uses the exact same layout as everyone else's, plus a "+" tile and a manage link.
export default function InterestCard({ logs = [], onOpenLogs }) {
  return (
    <LogShowcase
      title="Interest"
      logs={logs}
      action={{
        label: logs.length ? `Manage logs (${logs.length})` : "Add your first log",
        onClick: onOpenLogs,
      }}
      onAdd={onOpenLogs}
      emptyText="Nothing logged yet. What you add shows up here, and it’s how people find you."
    />
  );
}
