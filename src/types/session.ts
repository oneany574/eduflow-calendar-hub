export type SessionStatus = 'in-progress' | 'scheduled' | 'completed' | 'conflict' | 'upcoming' | 'cancelled';
export type CalendarView = 'monthly' | 'weekly' | 'daily';
export type UserRole = 'instructor' | 'student' | 'admin';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Session {
  id: string;
  title: string;
  description: string;
  status: SessionStatus;
  date: string; // ISO date
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  section: string;
  room: string;
  topic: string;
  studentCount: number;
  instructor: string;
  module: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  conflictWith?: string;
  resources?: { name: string; url: string }[];
}

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  sessionId: string;
}

export interface FilterState {
  classFilter: string;
  sectionFilter: string;
  statusFilter: string;
  moduleFilter: string;
  search: string;
}
