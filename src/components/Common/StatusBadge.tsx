import { SessionStatus } from '@/types/session';

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  scheduled: { label: 'SCHEDULED', className: 'status-scheduled' },
  'in-progress': { label: 'IN PROGRESS', className: 'status-in-progress' },
  completed: { label: 'COMPLETED', className: 'status-completed' },
  cancelled: { label: 'CANCELLED', className: 'status-cancelled' },
  rescheduled: { label: 'RESCHEDULED', className: 'status-rescheduled' },
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
