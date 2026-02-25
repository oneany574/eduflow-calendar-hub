import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Session, AttendanceStatus } from '@/types/session';
import { useSessionContext } from '@/contexts/SessionContext';
import { Check, X, Clock, ShieldCheck } from 'lucide-react';

interface TakeAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

const statusConfig: Record<AttendanceStatus, { label: string; icon: typeof Check; className: string }> = {
  present: { label: 'P', icon: Check, className: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400' },
  absent: { label: 'A', icon: X, className: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400' },
  late: { label: 'L', icon: Clock, className: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400' },
  excused: { label: 'E', icon: ShieldCheck, className: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400' },
};

const allStatuses: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

export function TakeAttendanceDialog({ open, onClose, session }: TakeAttendanceDialogProps) {
  const { getAttendance, saveAttendance } = useSessionContext();
  const [attendance, setAttendance] = useState<{ studentId: string; studentName: string; status: AttendanceStatus }[]>([]);

  useEffect(() => {
    if (session && open) {
      setAttendance(getAttendance(session.id));
    }
  }, [session, open, getAttendance]);

  const toggleStatus = (studentId: string) => {
    setAttendance(prev => prev.map(a => {
      if (a.studentId !== studentId) return a;
      const idx = allStatuses.indexOf(a.status);
      return { ...a, status: allStatuses[(idx + 1) % allStatuses.length] };
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    setAttendance(prev => prev.map(a => ({ ...a, status })));
  };

  const handleSave = () => {
    if (!session) return;
    saveAttendance(session.id, attendance);
    onClose();
  };

  if (!session) return null;

  const summary = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length,
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Take Attendance</DialogTitle>
          <p className="text-sm text-muted-foreground">{session.title} • {session.section}</p>
        </DialogHeader>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Mark all:</span>
          {allStatuses.map(s => (
            <Button key={s} variant="outline" size="sm" className="text-xs capitalize h-7 px-2" onClick={() => markAll(s)}>
              {s}
            </Button>
          ))}
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 text-xs">
          {Object.entries(summary).map(([status, count]) => {
            const cfg = statusConfig[status as AttendanceStatus];
            return (
              <span key={status} className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${cfg.className}`}>
                  {cfg.label}
                </span>
                <span className="text-muted-foreground">{count}</span>
              </span>
            );
          })}
        </div>

        {/* Student list */}
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {attendance.map((a, i) => {
            const cfg = statusConfig[a.status];
            return (
              <div key={a.studentId} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    {a.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium text-foreground">{a.studentName}</span>
                </div>
                <button
                  onClick={() => toggleStatus(a.studentId)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${cfg.className}`}
                >
                  {cfg.label}
                </button>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
