import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Session } from '@/types/session';
import { useSessionContext } from '@/contexts/SessionContext';

interface DeleteSessionDialogProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export function DeleteSessionDialog({ open, onClose, session }: DeleteSessionDialogProps) {
  const { deleteSession } = useSessionContext();

  const handleDelete = () => {
    if (session) {
      deleteSession(session.id);
      onClose();
    }
  };

  if (!session) return null;

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{session.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
