import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { modules, sections, classes } from '@/data/mockSessions';
import { FilterState } from '@/types/session';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  variant?: 'instructor' | 'student';
}

export function FilterBar({ filters, onChange, variant = 'instructor' }: FilterBarProps) {
  const update = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {variant === 'instructor' ? (
        <>
          <Select value={filters.classFilter} onValueChange={(v) => update('classFilter', v)}>
            <SelectTrigger className="w-[160px] bg-card border-border">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sectionFilter} onValueChange={(v) => update('sectionFilter', v)}>
            <SelectTrigger className="w-[160px] bg-card border-border">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.statusFilter} onValueChange={(v) => update('statusFilter', v)}>
            <SelectTrigger className="w-[160px] bg-card border-border">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <Select value={filters.moduleFilter} onValueChange={(v) => update('moduleFilter', v)}>
            <SelectTrigger className="w-[170px] bg-card border-border">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.statusFilter} onValueChange={(v) => update('statusFilter', v)}>
            <SelectTrigger className="w-[150px] bg-card border-border">
              <SelectValue placeholder="Status: Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: Any</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
