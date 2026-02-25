import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Session, SessionStatus, AttendanceStatus } from '@/types/session';
import { mockSessions } from '@/data/mockSessions';
import { toast } from '@/hooks/use-toast';

interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
}

interface SessionContextType {
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  startSession: (id: string) => void;
  endSession: (id: string) => void;
  rescheduleSession: (id: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  getAttendance: (sessionId: string) => StudentAttendance[];
  saveAttendance: (sessionId: string, attendance: StudentAttendance[]) => void;
  checkConflicts: (date: string, startTime: string, endTime: string, room: string, excludeId?: string) => Session[];
}

const SessionContext = createContext<SessionContextType | null>(null);

// Mock students for attendance
const mockStudents = [
  { studentId: 's1', studentName: 'Alice Johnson' },
  { studentId: 's2', studentName: 'Bob Williams' },
  { studentId: 's3', studentName: 'Carlos Garcia' },
  { studentId: 's4', studentName: 'Diana Chen' },
  { studentId: 's5', studentName: 'Ethan Brown' },
  { studentId: 's6', studentName: 'Fiona Davis' },
  { studentId: 's7', studentName: 'George Martinez' },
  { studentId: 's8', studentName: 'Hannah Lee' },
  { studentId: 's9', studentName: 'Isaac Taylor' },
  { studentId: 's10', studentName: 'Julia Wilson' },
];

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, StudentAttendance[]>>({});

  const addSession = useCallback((session: Omit<Session, 'id'>) => {
    const id = `s-${Date.now()}`;
    setSessions(prev => [...prev, { ...session, id }]);
    toast({ title: 'Session Created', description: `"${session.title}" has been created.` });
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    toast({ title: 'Session Updated', description: 'Session has been updated successfully.' });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const session = prev.find(s => s.id === id);
      if (session) {
        toast({ title: 'Session Deleted', description: `"${session.title}" has been removed.` });
      }
      return prev.filter(s => s.id !== id);
    });
  }, []);

  const startSession = useCallback((id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'in-progress' as SessionStatus } : s));
    toast({ title: 'Session Started', description: 'The session is now in progress.' });
  }, []);

  const endSession = useCallback((id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' as SessionStatus } : s));
    toast({ title: 'Session Ended', description: 'The session has been marked as completed.' });
  }, []);

  const rescheduleSession = useCallback((id: string, newDate: string, newStartTime: string, newEndTime: string) => {
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, date: newDate, startTime: newStartTime, endTime: newEndTime, status: 'scheduled' as SessionStatus, conflictWith: undefined } : s
    ));
    toast({ title: 'Session Rescheduled', description: 'The session has been moved to the new date/time.' });
  }, []);

  const getAttendance = useCallback((sessionId: string): StudentAttendance[] => {
    if (attendanceMap[sessionId]) return attendanceMap[sessionId];
    // Generate default attendance list
    const session = sessions.find(s => s.id === sessionId);
    const count = session?.studentCount || 10;
    return mockStudents.slice(0, Math.min(count, mockStudents.length)).map(s => ({
      ...s,
      status: 'present' as AttendanceStatus,
    }));
  }, [attendanceMap, sessions]);

  const saveAttendance = useCallback((sessionId: string, attendance: StudentAttendance[]) => {
    setAttendanceMap(prev => ({ ...prev, [sessionId]: attendance }));
    toast({ title: 'Attendance Saved', description: `Attendance recorded for ${attendance.length} students.` });
  }, []);

  const checkConflicts = useCallback((date: string, startTime: string, endTime: string, room: string, excludeId?: string): Session[] => {
    return sessions.filter(s => {
      if (s.id === excludeId) return false;
      if (s.date !== date) return false;
      if (s.status === 'cancelled') return false;
      // Time overlap check
      const sStart = parseInt(s.startTime.replace(':', ''));
      const sEnd = parseInt(s.endTime.replace(':', ''));
      const nStart = parseInt(startTime.replace(':', ''));
      const nEnd = parseInt(endTime.replace(':', ''));
      const timeOverlap = nStart < sEnd && nEnd > sStart;
      if (!timeOverlap) return false;
      // Same room = definite conflict
      if (s.room === room) return true;
      // Same instructor = conflict
      return false;
    });
  }, [sessions]);

  return (
    <SessionContext.Provider value={{
      sessions, addSession, updateSession, deleteSession,
      startSession, endSession, rescheduleSession,
      getAttendance, saveAttendance, checkConflicts,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSessionContext must be used within SessionProvider');
  return ctx;
}
