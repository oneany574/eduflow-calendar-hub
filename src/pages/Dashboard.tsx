import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users, BarChart3, ClipboardCheck, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Sessions Calendar', desc: 'View and manage all sessions', icon: CalendarDays, url: '/sessions', color: 'bg-primary/10 text-primary' },
    { title: 'Attendance', desc: 'Track student attendance', icon: ClipboardCheck, url: '/attendance', color: 'bg-eduflow-green/10 text-eduflow-green' },
    { title: 'Classes', desc: 'Manage classes and sections', icon: Users, url: '/classes', color: 'bg-eduflow-purple/10 text-eduflow-purple' },
    { title: 'Analytics', desc: 'View performance metrics', icon: BarChart3, url: '/analytics', color: 'bg-eduflow-orange/10 text-eduflow-orange' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Prof. Anderson</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your sessions today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Today\'s Sessions', value: '5', sub: '2 in progress' },
          { label: 'Total Students', value: '142', sub: 'Across 6 classes' },
          { label: 'Avg Attendance', value: '92%', sub: '+3% from last week' },
          { label: 'Upcoming Conflicts', value: '2', sub: 'Needs resolution' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.url}
            onClick={() => navigate(card.url)}
            className="bg-card rounded-xl border border-border p-5 text-left hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
