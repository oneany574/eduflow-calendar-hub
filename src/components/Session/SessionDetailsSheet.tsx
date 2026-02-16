import { Session } from '@/types/session';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User, FileText, Paperclip, X } from 'lucide-react';
import { StatusBadge } from '@/components/Common/StatusBadge';

interface SessionDetailsSheetProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

const iconMap: Record<string, string> = {
  Mathematics: 'Σ',
  Design: '🎨',
  Engineering: '⚙️',
  Physics: '⚛️',
  Research: '🔬',
};

export function SessionDetailsSheet({ session, open, onClose }: SessionDetailsSheetProps) {
  if (!session) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[420px] sm:w-[440px] p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-semibold">Session Details</SheetTitle>
        </SheetHeader>

        {/* Hero banner */}
        <div className="mx-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 h-40 flex items-center justify-center">
          <span className="text-5xl text-primary-foreground font-bold">
            {iconMap[session.module] || '📚'}
          </span>
        </div>

        <div className="px-6 pt-4 pb-6 space-y-5">
          <h2 className="text-xl font-bold text-foreground">{session.title}</h2>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {session.module}
            </span>
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border">
              Level: {session.level}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>

          {/* Instructor */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground">INSTRUCTOR</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">{session.instructor}</span>
            </div>
          </div>

          {/* Resources */}
          {session.resources && session.resources.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold tracking-widest text-muted-foreground">RESOURCES</p>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  {session.resources.map((r) => (
                    <a key={r.name} href={r.url} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <Paperclip className="h-3.5 w-3.5" /> {r.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Join Session
            </Button>
            <Button variant="outline" className="flex-1">
              Add to Calendar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
