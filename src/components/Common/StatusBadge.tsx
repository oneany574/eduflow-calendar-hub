import { SessionStatus } from '@/types/session';

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  'in-progress': { label: 'IN PROGRESS', className: 'status-in-progress' },
  scheduled: { label: 'SCHEDULED', className: 'status-scheduled' },
  completed: { label: 'COMPLETED', className: 'status-completed' },
  conflict: { label: 'CONFLICT', className: 'status-conflict' },
  upcoming: { label: 'UPCOMING', className: 'status-upcoming' },
  cancelled: { label: 'CANCELLED', className: 'status-upcoming' },
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
