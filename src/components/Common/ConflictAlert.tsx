import { AlertTriangle } from 'lucide-react';

interface ConflictAlertProps {
  message: string;
  details: string;
}

export function ConflictAlert({ message, details }: ConflictAlertProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-eduflow-orange-light px-4 py-3 border border-eduflow-orange/20">
      <AlertTriangle className="h-5 w-5 text-eduflow-orange mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">{details}</p>
      </div>
      <button className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap">
        Resolve Now
      </button>
    </div>
  );
}
