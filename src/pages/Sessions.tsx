import { useState } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';
import { MonthlyCalendar } from '@/components/Calendar/MonthlyCalendar';
import { WeeklyView } from '@/components/Calendar/WeeklyView';
import { DailyView } from '@/components/Calendar/DailyView';
import { CalendarLegend } from '@/components/Calendar/CalendarLegend';
import { FilterBar } from '@/components/Common/FilterBar';
import { ConflictAlert } from '@/components/Common/ConflictAlert';
import { DayPreview } from '@/components/Sidebar/DayPreview';
import { TodaysAgenda } from '@/components/Sidebar/TodaysAgenda';
import { SessionDetailsSheet } from '@/components/Session/SessionDetailsSheet';
import { Session, CalendarView } from '@/types/session';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function SessionsPage() {
  const { role } = useOutletContext<{ role: string }>();
  const cal = useCalendar();
  const [detailSession, setDetailSession] = useState<Session | null>(null);

  const isInstructor = role === 'instructor' || role === 'admin';

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
      {/* Conflict banner */}
      <div className="mb-4">
        <ConflictAlert
          message="Session Conflict Detected"
          details={'"Advanced Algorithms" and "Intro to UI Design" overlap on Thursday, Oct 24th from 10:00 AM - 11:30 AM. Please resolve the conflict.'}
        />
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-foreground">
          {isInstructor ? 'Instructor Sessions Calendar' : 'Sessions Calendar'}
        </h1>
        <div className="flex items-center gap-3">
          <ViewToggle />
          {isInstructor && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Session
            </Button>
          )}
          {!isInstructor && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> Book Session
            </Button>
          )}
        </div>
      </div>

      {/* Filters + navigation */}
      <div className="flex items-center justify-between mb-5">
        <FilterBar
          filters={cal.filters}
          onChange={cal.setFilters}
          variant={isInstructor ? 'instructor' : 'student'}
        />
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

      {/* Main content area */}
      <div className="flex gap-6">
        {/* Calendar area */}
        <div className="flex-1 min-w-0">
          {/* Month/week label */}
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
              {/* Show daily view below the week strip */}
              <div className="mt-6">
                <DailyView sessions={cal.selectedDateSessions} onViewDetails={setDetailSession} />
              </div>
            </>
          )}

          {cal.view === 'daily' && (
            <DailyView sessions={cal.selectedDateSessions} onViewDetails={setDetailSession} />
          )}
        </div>

        {/* Side panel - only in monthly view */}
        {cal.view === 'monthly' && (
          <div className="w-[340px] shrink-0">
            {isInstructor ? (
              <DayPreview
                date={cal.selectedDate}
                sessions={cal.selectedDateSessions}
                onViewDetails={setDetailSession}
              />
            ) : (
              <TodaysAgenda
                date={cal.selectedDate}
                sessions={cal.selectedDateSessions}
                onViewDetails={setDetailSession}
              />
            )}
          </div>
        )}
      </div>

      {/* Session details sheet */}
      <SessionDetailsSheet
        session={detailSession}
        open={!!detailSession}
        onClose={() => setDetailSession(null)}
      />
    </div>
  );
}
