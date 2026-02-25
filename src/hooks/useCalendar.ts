import { useState, useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { CalendarView, FilterState, Session } from '@/types/session';
import { useSessionContext } from '@/contexts/SessionContext';

export function useCalendar() {
  const { sessions } = useSessionContext();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 23));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 9, 23));
  const [view, setView] = useState<CalendarView>('monthly');
  const [filters, setFilters] = useState<FilterState>({
    classFilter: 'all',
    sectionFilter: 'all',
    statusFilter: 'all',
    moduleFilter: 'all',
    search: '',
  });

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (filters.sectionFilter !== 'all' && s.section !== filters.sectionFilter) return false;
      if (filters.statusFilter !== 'all' && s.status !== filters.statusFilter) return false;
      if (filters.moduleFilter !== 'all' && s.module !== filters.moduleFilter) return false;
      if (filters.search && !s.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !s.instructor.toLowerCase().includes(filters.search.toLowerCase()) &&
          !s.topic.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters, sessions]);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  }, [currentDate]);

  const parseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const sessionsForDate = (date: Date) =>
    filteredSessions.filter((s) => isSameDay(parseDate(s.date), date));

  const selectedDateSessions = useMemo(
    () => sessionsForDate(selectedDate),
    [selectedDate, filteredSessions]
  );

  const navigate = (dir: 'prev' | 'next') => {
    if (view === 'monthly') setCurrentDate(dir === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    else if (view === 'weekly') setCurrentDate(dir === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    else setCurrentDate(dir === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
  };

  const goToToday = () => {
    const today = new Date(2024, 9, 23);
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    filters,
    setFilters,
    filteredSessions,
    monthDays,
    weekDays,
    sessionsForDate,
    selectedDateSessions,
    navigate,
    goToToday,
    isSameMonth: (d: Date) => isSameMonth(d, currentDate),
    isToday: (d: Date) => isSameDay(d, new Date(2024, 9, 23)),
    isSelected: (d: Date) => isSameDay(d, selectedDate),
  };
}
