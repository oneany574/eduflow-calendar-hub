export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled';
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

export interface Classroom {
  id: string;
  name: string;
  roomNumber: string;
  building: string;
}

export interface ClassSchedule {
  id: string;
  scheduleType: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ClassSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  topic: string;
  description: string;
  classroom: Classroom;
  classSchedule: ClassSchedule;
}

export interface SessionAttendanceOverview {
  id: string;
  status: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  halfDayCount: number;
  attendanceRate: string;
  absenteeRate: string;
}

export interface AttendanceRecord {
  id: string;
  status: AttendanceStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  minutesLate: number;
  isExcused: boolean;
  excuseReason: string | null;
  excuseProof: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  classSession: ClassSession;
  sessionAttendanceOverview: SessionAttendanceOverview;
  excusedBy: string | null;
}

export interface FilterState {
  classFilter: string;
  sectionFilter: string;
  statusFilter: string;
  moduleFilter: string;
  search: string;
}
