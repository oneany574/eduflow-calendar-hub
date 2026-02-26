import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockAttendance } from '@/data/mockSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_CONFIG = [
  { key: 'present', label: 'Present', color: 'hsl(152, 60%, 45%)' },
  { key: 'absent', label: 'Absent', color: 'hsl(0, 84%, 60%)' },
  { key: 'late', label: 'Late', color: 'hsl(32, 95%, 55%)' },
  { key: 'excused', label: 'Excused', color: 'hsl(215, 16%, 60%)' },
];

export function AttendancePieChart() {
  const data = useMemo(() => {
    const counts: Record<string, number> = { present: 0, absent: 0, late: 0, excused: 0 };
    mockAttendance.forEach((a) => counts[a.status]++);
    return STATUS_CONFIG.map((s) => ({ name: s.label, value: counts[s.key], color: s.color })).filter((d) => d.value > 0);
  }, []);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} (${Math.round((value / total) * 100)}%)`, name]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{entry.value}</span>
                <span className="text-xs text-muted-foreground">({Math.round((entry.value / total) * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">Total Sessions</p>
          <p className="text-2xl font-bold text-foreground">{total}</p>
        </div>
      </CardContent>
    </Card>
  );
}
