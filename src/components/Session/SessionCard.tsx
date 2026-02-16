import { Session } from '@/types/session';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { AlertTriangle, Clock, FileText, MoreVertical, Play, Users, UserCheck, CalendarClock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionCardProps {
  session: Session;
  variant?: 'full' | 'compact' | 'agenda';
  onViewDetails?: (session: Session) => void;
}

const borderColors: Record<string, string> = {
  'in-progress': 'border-l-eduflow-purple',
  scheduled: 'border-l-primary',
  completed: 'border-l-eduflow-green',
  conflict: 'border-l-eduflow-orange',
  upcoming: 'border-l-eduflow-gray',
  cancelled: 'border-l-muted-foreground',
};

export function SessionCard({ session, variant = 'full', onViewDetails }: SessionCardProps) {
  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg bg-card border border-border p-4 border-l-4 ${borderColors[session.status]}`}>
        <div className="flex items-start justify-between mb-1">
          <StatusBadge status={session.status} />
          <span className="text-xs text-muted-foreground">{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
        </div>
        <h4 className="font-semibold text-foreground mt-2">{session.title}</h4>
        <p className="text-sm text-muted-foreground">{session.section} • {session.room}</p>
        {session.status === 'in-progress' && (
          <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <UserCheck className="h-4 w-4 mr-1.5" /> Take Attendance
          </Button>
        )}
        {session.status === 'scheduled' && (
          <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="h-4 w-4 mr-1.5" /> Start Session
          </Button>
        )}
        {(session.status === 'upcoming' || session.status === 'completed') && (
          <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => onViewDetails?.(session)}>
            View Details
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'agenda') {
    return (
      <div className={`rounded-lg bg-card border border-border p-4 border-l-4 ${borderColors[session.status]} cursor-pointer hover:shadow-sm transition-shadow`} onClick={() => onViewDetails?.(session)}>
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
    <div className={`rounded-xl bg-card border border-border p-5 border-l-4 ${borderColors[session.status]} relative`}>
      {session.status === 'conflict' && (
        <AlertTriangle className="absolute top-4 right-4 h-5 w-5 text-eduflow-orange" />
      )}
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
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserCheck className="h-4 w-4 mr-1.5" /> Take Attendance
            </Button>
          )}
          {session.status === 'scheduled' && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="h-4 w-4 mr-1.5" /> Start Session
            </Button>
          )}
          {session.status === 'conflict' && (
            <Button variant="outline">
              <CalendarClock className="h-4 w-4 mr-1.5" /> Reschedule
            </Button>
          )}
          {session.status === 'upcoming' && (
            <Button variant="outline">
              <CalendarClock className="h-4 w-4 mr-1.5" /> Start Session
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
