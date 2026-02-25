import { useState } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';
import { useSessionContext } from '@/contexts/SessionContext';
import { MonthlyCalendar } from '@/components/Calendar/MonthlyCalendar';
import { WeeklyView } from '@/components/Calendar/WeeklyView';
import { DailyView } from '@/components/Calendar/DailyView';
import { CalendarLegend } from '@/components/Calendar/CalendarLegend';
import { FilterBar } from '@/components/Common/FilterBar';
import { ConflictAlert } from '@/components/Common/ConflictAlert';
import { DayPreview } from '@/components/Sidebar/DayPreview';
import { TodaysAgenda } from '@/components/Sidebar/TodaysAgenda';
import { SessionDetailsSheet } from '@/components/Session/SessionDetailsSheet';
import { SessionFormDialog } from '@/components/Session/SessionFormDialog';
import { TakeAttendanceDialog } from '@/components/Session/TakeAttendanceDialog';
import { RescheduleDialog } from '@/components/Session/RescheduleDialog';
import { DeleteSessionDialog } from '@/components/Session/DeleteSessionDialog';
import { Session, CalendarView } from '@/types/session';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function SessionsPage() {
  const { role } = useOutletContext<{ role: string }>();
  const cal = useCalendar();
  const { startSession, endSession } = useSessionContext();

  const [detailSession, setDetailSession] = useState<Session | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [attendanceSession, setAttendanceSession] = useState<Session | null>(null);
  const [rescheduleSession, setRescheduleSession] = useState<Session | null>(null);
  const [deleteSession, setDeleteSession] = useState<Session | null>(null);

  const isInstructor = role === 'instructor' || role === 'admin';

  const handleStartSession = (s: Session) => startSession(s.id);
  const handleEndSession = (s: Session) => endSession(s.id);
  const handleEdit = (s: Session) => { setEditSession(s); setFormOpen(true); };
  const handleNewSession = () => { setEditSession(null); setFormOpen(true); };

  const actionProps = {
    onViewDetails: setDetailSession,
    onStartSession: handleStartSession,
    onEndSession: handleEndSession,
    onTakeAttendance: setAttendanceSession,
    onReschedule: setRescheduleSession,
    onEdit: handleEdit,
    onDelete: setDeleteSession,
  };

  const ViewToggle = () => (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {(['monthly', 'weekly', 'daily'] as CalendarView[]).map((v) => (
        <button
          key={v}
          onClick={() => cal.setView(v)}
          className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
            cal.view === v ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-accent'
          }`}
        >
          {v === 'monthly' ? 'Monthly' : v === 'weekly' ? 'Weekly' : 'Daily'}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <ConflictAlert
          message="Session Conflict Detected"
          details={'"Advanced Algorithms" and "Intro to UI Design" overlap on Thursday, Oct 24th from 10:00 AM - 11:30 AM. Please resolve the conflict.'}
        />
      </div>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-foreground">
          {isInstructor ? 'Instructor Sessions Calendar' : 'Sessions Calendar'}
        </h1>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleNewSession}>
            <Plus className="h-4 w-4 mr-1.5" /> {isInstructor ? 'New Session' : 'Book Session'}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <FilterBar filters={cal.filters} onChange={cal.setFilters} variant={isInstructor ? 'instructor' : 'student'} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={cal.goToToday}>Today</Button>
          <Button variant="ghost" size="icon" onClick={() => cal.navigate('prev')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => cal.navigate('next')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-foreground">
              {format(cal.currentDate, cal.view === 'daily' ? 'EEEE, MMMM d, yyyy' : 'MMMM yyyy')}
            </h2>
          </div>

          {cal.view === 'monthly' && (
            <>
              <MonthlyCalendar
                days={cal.monthDays}
                sessionsForDate={cal.sessionsForDate}
                isSameMonth={cal.isSameMonth}
                isToday={cal.isToday}
                isSelected={cal.isSelected}
                onSelectDate={cal.setSelectedDate}
              />
              <CalendarLegend />
            </>
          )}

          {cal.view === 'weekly' && (
            <>
              <WeeklyView
                days={cal.weekDays}
                sessionsForDate={cal.sessionsForDate}
                isToday={cal.isToday}
                isSelected={cal.isSelected}
                onSelectDate={cal.setSelectedDate}
              />
              <div className="mt-6">
                <DailyView sessions={cal.selectedDateSessions} {...actionProps} />
              </div>
            </>
          )}

          {cal.view === 'daily' && (
            <DailyView sessions={cal.selectedDateSessions} {...actionProps} />
          )}
        </div>

        {cal.view === 'monthly' && (
          <div className="w-[340px] shrink-0">
            {isInstructor ? (
              <DayPreview date={cal.selectedDate} sessions={cal.selectedDateSessions} {...actionProps} />
            ) : (
              <TodaysAgenda date={cal.selectedDate} sessions={cal.selectedDateSessions} onViewDetails={setDetailSession} />
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SessionDetailsSheet session={detailSession} open={!!detailSession} onClose={() => setDetailSession(null)} />
      <SessionFormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditSession(null); }} session={editSession} />
      <TakeAttendanceDialog open={!!attendanceSession} onClose={() => setAttendanceSession(null)} session={attendanceSession} />
      <RescheduleDialog open={!!rescheduleSession} onClose={() => setRescheduleSession(null)} session={rescheduleSession} />
      <DeleteSessionDialog open={!!deleteSession} onClose={() => setDeleteSession(null)} session={deleteSession} />
    </div>
  );
}
