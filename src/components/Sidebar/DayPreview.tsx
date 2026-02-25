import { format } from 'date-fns';
import { Session } from '@/types/session';
import { SessionCard } from '@/components/Session/SessionCard';
import { AlertTriangle } from 'lucide-react';

interface DayPreviewProps {
  date: Date;
  sessions: Session[];
  onViewDetails?: (session: Session) => void;
  onStartSession?: (session: Session) => void;
  onEndSession?: (session: Session) => void;
  onTakeAttendance?: (session: Session) => void;
  onReschedule?: (session: Session) => void;
  onEdit?: (session: Session) => void;
  onDelete?: (session: Session) => void;
}

export function DayPreview({ date, sessions, onViewDetails, onStartSession, onEndSession, onTakeAttendance, onReschedule, onEdit, onDelete }: DayPreviewProps) {
  const hasConflicts = sessions.some((s) => s.status === 'conflict');
  const cardProps = { onViewDetails, onStartSession, onEndSession, onTakeAttendance, onReschedule, onEdit, onDelete };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-primary tracking-wider">DAY PREVIEW</h3>
        <span className="text-xs font-semibold text-primary bg-secondary px-2.5 py-1 rounded-full">
          {sessions.length} Session{sessions.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-lg font-semibold text-foreground mb-4">
        {format(date, 'EEEE, MMM do')}
      </p>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <SessionCard key={s.id} session={s} variant="compact" {...cardProps} />
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">No sessions on this date.</p>
          </div>
        )}
      </div>

      {hasConflicts && (
        <div className="mt-4 rounded-lg bg-eduflow-orange-light border border-eduflow-orange/20 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-eduflow-orange mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-eduflow-orange">Upcoming Conflict</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Check Friday 25th for schedule overlaps in Room 108.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
