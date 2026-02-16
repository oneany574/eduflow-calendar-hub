import { format } from 'date-fns';
import { Session } from '@/types/session';
import { SessionCard } from '@/components/Session/SessionCard';

interface TodaysAgendaProps {
  date: Date;
  sessions: Session[];
  onViewDetails?: (session: Session) => void;
}

export function TodaysAgenda({ date, sessions, onViewDetails }: TodaysAgendaProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold text-foreground">Today's Agenda</h3>
        <span className="text-xs font-semibold text-primary bg-secondary px-2.5 py-1 rounded-full">
          {sessions.length} Session{sessions.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{format(date, 'MMM d, yyyy')}</p>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <SessionCard key={s.id} session={s} variant="agenda" onViewDetails={onViewDetails} />
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">No sessions today. Enjoy your day off! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
