import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { mockAttendance } from '@/data/mockSessions';
import { AttendanceStatus } from '@/types/session';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const statusStyle: Record<AttendanceStatus, { letter: string; className: string }> = {
  present: { letter: 'P', className: 'attendance-present border' },
  absent: { letter: 'A', className: 'attendance-absent border' },
  late: { letter: 'L', className: 'attendance-late border' },
  excused: { letter: 'E', className: 'attendance-excused border' },
};

export function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1));
  const [statusFilter, setStatusFilter] = useState('all');
  const todayMock = new Date(2024, 9, 10);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });
  }, [currentDate]);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    mockAttendance.forEach((a) => {
      if (statusFilter === 'all' || a.status === statusFilter) {
        map.set(a.date, a.status);
      }
    });
    return map;
  }, [statusFilter]);

  const stats = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 };
    mockAttendance.forEach((a) => counts[a.status]++);
    const total = mockAttendance.length;
    const rate = total > 0 ? Math.round((counts.present / total) * 100) : 0;
    return { ...counts, rate };
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Advanced Mathematics</h1>
            <p className="text-sm text-muted-foreground mt-1">Instructor: Prof. Sarah Smith • Fall Semester 2023</p>
          </div>
          <div className="text-right flex items-start gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary">ATTENDANCE RATE</p>
              <p className={`text-4xl font-bold ${stats.rate >= 90 ? 'text-eduflow-green' : stats.rate >= 75 ? 'text-eduflow-orange' : 'text-eduflow-red'}`}>
                {stats.rate}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(var(--attendance-present))]" /> {stats.present} Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(var(--attendance-absent))]" /> {stats.absent} Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(var(--attendance-late))]" /> {stats.late} Late</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(var(--attendance-excused))]" /> {stats.excused} Excused</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground min-w-[160px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(2024, 9, 1))}>Today</Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="excused">Excused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground tracking-wider">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = attendanceMap.get(dateStr);
            const inMonth = isSameMonth(day, currentDate);
            const today = isSameDay(day, todayMock);

            return (
              <div
                key={i}
                className={`
                  min-h-[100px] p-2 border-b border-r border-border relative
                  ${!inMonth ? 'opacity-30' : ''}
                  ${today ? 'bg-secondary ring-2 ring-primary ring-inset' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${today ? 'text-primary font-bold' : !inMonth ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                  {today && (
                    <span className="text-[10px] font-bold text-primary">TODAY</span>
                  )}
                </div>
                {status && (
                  <div className="absolute inset-0 flex items-center justify-center pt-2">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${statusStyle[status].className}`}>
                      {statusStyle[status].letter}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {(Object.entries(statusStyle) as [AttendanceStatus, typeof statusStyle.present][]).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${val.className}`}>
              {val.letter}
            </span>
            <span className="text-sm text-muted-foreground capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
