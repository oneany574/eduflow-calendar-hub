import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Session } from '@/types/session';
import { useSessionContext } from '@/contexts/SessionContext';
import { AlertTriangle, CalendarClock } from 'lucide-react';

interface RescheduleDialogProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export function RescheduleDialog({ open, onClose, session }: RescheduleDialogProps) {
  const { rescheduleSession, checkConflicts } = useSessionContext();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [conflicts, setConflicts] = useState<Session[]>([]);

  useEffect(() => {
    if (session && open) {
      setDate(session.date);
      setStartTime(session.startTime);
      setEndTime(session.endTime);
      setConflicts([]);
    }
  }, [session, open]);

  useEffect(() => {
    if (date && startTime && endTime && session) {
      setConflicts(checkConflicts(date, startTime, endTime, session.room, session.id));
    }
  }, [date, startTime, endTime, session, checkConflicts]);

  const handleSave = () => {
    if (!session || !date || !startTime || !endTime) return;
    rescheduleSession(session.id, date, startTime, endTime);
    onClose();
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Reschedule Session
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{session.title}</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {conflicts.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">
                Conflicts with: {conflicts.map(c => `"${c.title}"`).join(', ')}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>New Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <p><span className="font-medium">Room:</span> {session.room}</p>
            <p><span className="font-medium">Section:</span> {session.section}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
