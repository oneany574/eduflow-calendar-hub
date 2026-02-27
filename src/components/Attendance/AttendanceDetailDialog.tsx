import { format } from 'date-fns';
import { AttendanceRecord, AttendanceStatus } from '@/types/session';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Clock, LogIn, LogOut, AlertTriangle, FileText, CalendarDays, MapPin, BookOpen, Building } from 'lucide-react';

const statusConfig: Record<AttendanceStatus, { label: string; className: string }> = {
  present: { label: 'Present', className: 'bg-[hsl(var(--attendance-present))] text-white' },
  absent: { label: 'Absent', className: 'bg-[hsl(var(--attendance-absent))] text-white' },
  late: { label: 'Late', className: 'bg-[hsl(var(--attendance-late))] text-white' },
  excused: { label: 'Excused', className: 'bg-[hsl(var(--attendance-excused))] text-white' },
};

interface AttendanceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  record: AttendanceRecord | null;
}

function formatTime(isoTime: string | null): string {
  if (!isoTime) return '—';
  try {
    return format(new Date(isoTime), 'hh:mm a');
  } catch {
    return isoTime;
  }
}

export function AttendanceDetailDialog({ open, onClose, date, record }: AttendanceDetailDialogProps) {
  if (!date) return null;

  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
  const config = record ? statusConfig[record.status] : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Attendance Details
          </DialogTitle>
          <DialogDescription>{formattedDate}</DialogDescription>
        </DialogHeader>

        {!record ? (
          <div className="py-8 text-center text-muted-foreground">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No attendance record</p>
            <p className="text-sm mt-1">There is no session recorded for this date.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${config?.className}`}>
                {config?.label}
              </span>
              {record.classSession.topic && (
                <span className="text-sm text-muted-foreground font-medium">{record.classSession.topic}</span>
              )}
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{record.classSession.classSchedule.scheduleType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{record.classSession.classroom.name} ({record.classSession.classroom.roomNumber})</span>
              </div>
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{record.classSession.classroom.building}</span>
              </div>
            </div>

            {/* Time Details */}
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Time Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in</p>
                    <p className="text-sm font-medium">{formatTime(record.checkInTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out</p>
                    <p className="text-sm font-medium">{formatTime(record.checkOutTime)}</p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                Session: {record.classSession.startTime} – {record.classSession.endTime}
              </div>
            </div>

            {/* Late Time */}
            {record.status === 'late' && record.minutesLate > 0 && (
              <div className="bg-[hsl(var(--attendance-late)/0.1)] border border-[hsl(var(--attendance-late)/0.3)] rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--attendance-late))] mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Late by {record.minutesLate} minutes</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Student arrived after the scheduled start time.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Excuse Reason */}
            {record.isExcused && record.excuseReason && (
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Excuse Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{record.excuseReason}</p>
                    {record.excusedBy && (
                      <p className="text-xs text-muted-foreground mt-1">Approved by: {record.excusedBy}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {record.notes && (
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Notes</p>
                    <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Session Overview */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Session Overview</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{record.sessionAttendanceOverview.presentCount}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{record.sessionAttendanceOverview.absentCount}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{record.sessionAttendanceOverview.lateCount}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-border text-center">
                <span className="text-xs text-muted-foreground">Attendance Rate: </span>
                <span className="text-sm font-bold text-primary">{record.sessionAttendanceOverview.attendanceRate}%</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
