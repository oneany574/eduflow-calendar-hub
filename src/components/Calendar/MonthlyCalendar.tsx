import { format } from 'date-fns';
import { Session } from '@/types/session';

interface MonthlyCalendarProps {
  days: Date[];
  sessionsForDate: (date: Date) => Session[];
  isSameMonth: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
}

const dotClass: Record<string, string> = {
  scheduled: 'dot-scheduled',
  'in-progress': 'dot-in-progress',
  completed: 'dot-completed',
  cancelled: 'dot-cancelled',
  rescheduled: 'dot-rescheduled',
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function MonthlyCalendar({ days, sessionsForDate, isSameMonth, isToday, isSelected, onSelectDate }: MonthlyCalendarProps) {
  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const sessions = sessionsForDate(day);
          const inMonth = isSameMonth(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`
                relative min-h-[90px] p-2 border-b border-r border-border text-left transition-colors
                hover:bg-accent/50
                ${!inMonth ? 'opacity-40' : ''}
                ${selected ? 'bg-secondary ring-2 ring-primary ring-inset' : ''}
              `}
            >
              <span className={`
                text-sm font-medium
                ${today && !selected ? 'text-primary font-bold' : ''}
                ${selected ? 'text-primary font-bold' : ''}
                ${!inMonth ? 'text-muted-foreground' : 'text-foreground'}
              `}>
                {format(day, 'd')}
              </span>

              {/* Session dots */}
              {sessions.length > 0 && (
                <div className="flex gap-1 mt-auto absolute bottom-2 left-1/2 -translate-x-1/2">
                  {sessions.slice(0, 4).map((s, j) => (
                    <div key={j} className={`w-2 h-2 rounded-full ${dotClass[s.status]}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
