import { format } from 'date-fns';
import { Session } from '@/types/session';

interface WeeklyViewProps {
  days: Date[];
  sessionsForDate: (date: Date) => Session[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
}

const dotClass: Record<string, string> = {
  'in-progress': 'dot-in-progress',
  scheduled: 'dot-scheduled',
  completed: 'dot-completed',
  conflict: 'dot-conflict',
  upcoming: 'dot-scheduled',
  cancelled: 'dot-scheduled',
};

export function WeeklyView({ days, sessionsForDate, isToday, isSelected, onSelectDate }: WeeklyViewProps) {
  return (
    <div className="flex gap-2">
      {days.map((day, i) => {
        const sessions = sessionsForDate(day);
        const today = isToday(day);
        const selected = isSelected(day);

        return (
          <button
            key={i}
            onClick={() => onSelectDate(day)}
            className={`
              flex-1 rounded-xl border border-border p-4 text-center transition-all
              ${selected ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card hover:bg-accent/50'}
            `}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider ${selected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {format(day, 'EEE')}
            </p>
            <p className={`text-2xl font-bold mt-1 ${selected ? 'text-primary-foreground' : today ? 'text-primary' : 'text-foreground'}`}>
              {format(day, 'd')}
            </p>
            {sessions.length > 0 && (
              <div className="flex gap-1 justify-center mt-2">
                {sessions.slice(0, 3).map((s, j) => (
                  <div key={j} className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-primary-foreground/60' : dotClass[s.status]}`} />
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
