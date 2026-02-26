import { AttendanceCalendar } from '@/components/Attendance/AttendanceCalendar';
import { AttendancePieChart } from '@/components/Attendance/AttendancePieChart';

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
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <AttendanceCalendar />
        </div>
        <div className="w-[280px] shrink-0">
          <AttendancePieChart />
        </div>
      </div>
    </div>
  );
}
