import { Session } from '@/types/session';
import { SessionCard } from '@/components/Session/SessionCard';
import { MetricsSummary } from '@/components/Common/MetricsSummary';

interface DailyViewProps {
  sessions: Session[];
  onViewDetails?: (session: Session) => void;
}

export function DailyView({ sessions, onViewDetails }: DailyViewProps) {
  const morning = sessions.filter((s) => parseInt(s.startTime) < 12);
  const afternoon = sessions.filter((s) => parseInt(s.startTime) >= 12);

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 my-4">
      <span className="text-sm font-semibold text-primary">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );

  return (
    <div className="space-y-2">
      {morning.length > 0 && (
        <>
          <SectionLabel label="Morning" />
          <div className="space-y-3">
            {morning.map((s) => (
              <SessionCard key={s.id} session={s} variant="full" onViewDetails={onViewDetails} />
            ))}
          </div>
        </>
      )}
      {afternoon.length > 0 && (
        <>
          <SectionLabel label="Afternoon" />
          <div className="space-y-3">
            {afternoon.map((s) => (
              <SessionCard key={s.id} session={s} variant="full" onViewDetails={onViewDetails} />
            ))}
          </div>
        </>
      )}
      {sessions.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg font-medium">No sessions scheduled</p>
          <p className="text-sm mt-1">Select a different date or create a new session.</p>
        </div>
      )}
      {sessions.length > 0 && (
        <div className="mt-6">
          <MetricsSummary />
        </div>
      )}
    </div>
  );
}
