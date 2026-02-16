import { Clock, ClipboardCheck, Coffee } from 'lucide-react';

export function MetricsSummary() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Hours Today</p>
          <p className="text-lg font-bold text-foreground">6.5 hrs</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-eduflow-green-light">
          <ClipboardCheck className="h-5 w-5 text-eduflow-green" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg. Attendance</p>
          <p className="text-lg font-bold text-foreground">92%</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-eduflow-orange-light">
          <Coffee className="h-5 w-5 text-eduflow-orange" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Next Break</p>
          <p className="text-lg font-bold text-foreground">in 15m</p>
        </div>
      </div>
    </div>
  );
}
