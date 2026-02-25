import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Session, SessionStatus } from '@/types/session';
import { useSessionContext } from '@/contexts/SessionContext';
import { modules, sections } from '@/data/mockSessions';
import { AlertTriangle } from 'lucide-react';

interface SessionFormDialogProps {
  open: boolean;
  onClose: () => void;
  session?: Session | null; // null = create, session = edit
}

const emptyForm: {
  title: string; description: string; date: string; startTime: string; endTime: string;
  section: string; room: string; topic: string; studentCount: number; instructor: string;
  module: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; status: SessionStatus;
} = {
  title: '',
  description: '',
  date: '2024-10-23',
  startTime: '09:00',
  endTime: '10:30',
  section: 'Section A',
  room: '',
  topic: '',
  studentCount: 20,
  instructor: 'Prof. Anderson',
  module: 'Design',
  level: 'Intermediate',
  status: 'scheduled',
};

export function SessionFormDialog({ open, onClose, session }: SessionFormDialogProps) {
  const { addSession, updateSession, checkConflicts } = useSessionContext();
  const [form, setForm] = useState(emptyForm);
  const [conflicts, setConflicts] = useState<Session[]>([]);

  const isEdit = !!session;

  useEffect(() => {
    if (session) {
      setForm({
        title: session.title,
        description: session.description,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        section: session.section,
        room: session.room,
        topic: session.topic,
        studentCount: session.studentCount,
        instructor: session.instructor,
        module: session.module,
        level: session.level as 'Beginner' | 'Intermediate' | 'Advanced',
        status: session.status,
      });
    } else {
      setForm(emptyForm);
    }
    setConflicts([]);
  }, [session, open]);

  useEffect(() => {
    if (form.date && form.startTime && form.endTime && form.room) {
      const c = checkConflicts(form.date, form.startTime, form.endTime, form.room, session?.id);
      setConflicts(c);
    }
  }, [form.date, form.startTime, form.endTime, form.room, checkConflicts, session?.id]);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.title || !form.date || !form.startTime || !form.endTime || !form.room) return;
    if (isEdit && session) {
      updateSession(session.id, form);
    } else {
      addSession(form);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Session' : 'New Session'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Conflict warning */}
          {conflicts.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Room conflict detected</p>
                <p className="text-muted-foreground mt-0.5">
                  Overlaps with: {conflicts.map(c => `"${c.title}"`).join(', ')}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Session Title *</Label>
            <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Digital Design Fundamentals" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Session description..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={form.module} onValueChange={(v) => update('module', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => update('level', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input type="time" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Time *</Label>
              <Input type="time" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={form.section} onValueChange={(v) => update('section', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Room / Location *</Label>
              <Input value={form.room} onChange={(e) => update('room', e.target.value)} placeholder="e.g. Room 302" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input value={form.topic} onChange={(e) => update('topic', e.target.value)} placeholder="e.g. Color Theory" />
            </div>
            <div className="space-y-2">
              <Label>Student Count</Label>
              <Input type="number" value={form.studentCount} onChange={(e) => update('studentCount', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Instructor</Label>
            <Input value={form.instructor} onChange={(e) => update('instructor', e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.title || !form.room}>
            {isEdit ? 'Update Session' : 'Create Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
