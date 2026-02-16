import { AttendanceCalendar } from '@/components/Attendance/AttendanceCalendar';

export default function AttendancePage() {
  return (
    <div>
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <span>Dashboard</span>
        <span className="mx-1">›</span>
        <span>Classes</span>
        <span className="mx-1">›</span>
        <span>Advanced Mathematics</span>
        <span className="mx-1">›</span>
        <span className="text-foreground font-medium">Attendance</span>
      </nav>
      <AttendanceCalendar />
    </div>
  );
}
