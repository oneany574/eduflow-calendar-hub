import { Session } from '@/types/session';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { AlertTriangle, Clock, FileText, MoreVertical, Play, Users, UserCheck, CalendarClock, MapPin, Pencil, Trash2, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SessionCardProps {
  session: Session;
  variant?: 'full' | 'compact' | 'agenda';
  onViewDetails?: (session: Session) => void;
  onStartSession?: (session: Session) => void;
  onEndSession?: (session: Session) => void;
  onTakeAttendance?: (session: Session) => void;
  onReschedule?: (session: Session) => void;
  onEdit?: (session: Session) => void;
  onDelete?: (session: Session) => void;
}

const borderColors: Record<string, string> = {
  scheduled: 'border-l-primary',
  'in-progress': 'border-l-eduflow-purple',
  completed: 'border-l-eduflow-green',
  cancelled: 'border-l-destructive',
  rescheduled: 'border-l-eduflow-orange',
};

export function SessionCard({ session, variant = 'full', onViewDetails, onStartSession, onEndSession, onTakeAttendance, onReschedule, onEdit, onDelete }: SessionCardProps) {
  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const MoreMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails?.(session)}>
          <FileText className="h-4 w-4 mr-2" /> View Details
        </DropdownMenuItem>
        {session.status !== 'cancelled' && session.status !== 'completed' && (
          <DropdownMenuItem onClick={() => onEdit?.(session)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit Session
          </DropdownMenuItem>
        )}
        {session.status !== 'cancelled' && session.status !== 'completed' && (
          <DropdownMenuItem onClick={() => onReschedule?.(session)}>
            <CalendarClock className="h-4 w-4 mr-2" /> Reschedule
          </DropdownMenuItem>
        )}
        {session.status === 'in-progress' && (
          <DropdownMenuItem onClick={() => onEndSession?.(session)}>
            <StopCircle className="h-4 w-4 mr-2" /> End Session
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete?.(session)} className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" /> Delete Session
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg bg-card border border-border p-4 border-l-4 ${borderColors[session.status] || 'border-l-muted-foreground'}`}>
        <div className="flex items-start justify-between mb-1">
          <StatusBadge status={session.status} />
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
            <MoreMenu />
          </div>
        </div>
        <h4 className="font-semibold text-foreground mt-2">{session.title}</h4>
        <p className="text-sm text-muted-foreground">{session.section} • {session.room}</p>
        {session.status === 'in-progress' && (
          <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onTakeAttendance?.(session)}>
            <UserCheck className="h-4 w-4 mr-1.5" /> Take Attendance
          </Button>
        )}
        {session.status === 'scheduled' && (
          <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onStartSession?.(session)}>
            <Play className="h-4 w-4 mr-1.5" /> Start Session
          </Button>
        )}
        {session.status === 'rescheduled' && (
          <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onStartSession?.(session)}>
            <Play className="h-4 w-4 mr-1.5" /> Start Session
          </Button>
        )}
        {session.status === 'completed' && (
          <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => onViewDetails?.(session)}>
            View Details
          </Button>
        )}
        {session.status === 'cancelled' && (
          <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => onReschedule?.(session)}>
            <CalendarClock className="h-4 w-4 mr-1.5" /> Reschedule
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'agenda') {
    return (
      <div className={`rounded-lg bg-card border border-border p-4 border-l-4 ${borderColors[session.status] || 'border-l-muted-foreground'} cursor-pointer hover:shadow-sm transition-shadow`} onClick={() => onViewDetails?.(session)}>
        <div className="flex items-start justify-between mb-1">
          <StatusBadge status={session.status} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </span>
        </div>
        <h4 className="font-semibold text-foreground mt-2">{session.title}</h4>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3" /> {session.room}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card" />
            <div className="w-7 h-7 rounded-full bg-eduflow-green/20 border-2 border-card" />
          </div>
          <button className="text-sm font-medium text-primary hover:underline" onClick={(e) => { e.stopPropagation(); onViewDetails?.(session); }}>
            View Details →
          </button>
        </div>
      </div>
    );
  }

  // Full variant (daily view)
  return (
    <div className={`rounded-xl bg-card border border-border p-5 border-l-4 ${borderColors[session.status] || 'border-l-muted-foreground'} relative`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <StatusBadge status={session.status} />
            <span className="text-sm text-muted-foreground">{formatTime(session.startTime)} — {formatTime(session.endTime)}</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mt-1">{session.title}</h3>
          <p className="text-sm text-muted-foreground">{session.section} • {session.room}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            {session.topic && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> Topic: {session.topic}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {session.studentCount} Students
            </span>
          </div>
          {session.conflictWith && (
            <p className="text-sm text-eduflow-orange flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Conflict with "{session.conflictWith}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {session.status === 'in-progress' && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onTakeAttendance?.(session)}>
              <UserCheck className="h-4 w-4 mr-1.5" /> Take Attendance
            </Button>
          )}
          {(session.status === 'scheduled' || session.status === 'rescheduled') && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onStartSession?.(session)}>
              <Play className="h-4 w-4 mr-1.5" /> Start Session
            </Button>
          )}
          {session.status === 'cancelled' && (
            <Button variant="outline" onClick={() => onReschedule?.(session)}>
              <CalendarClock className="h-4 w-4 mr-1.5" /> Reschedule
            </Button>
          )}
          <MoreMenu />
        </div>
      </div>
    </div>
  );
}
