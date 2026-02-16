import { Outlet, useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, CalendarDays, Users, BarChart3, Settings, Bell, Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserRole } from '@/types/session';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Sessions', url: '/sessions', icon: CalendarDays },
  { title: 'Classes', url: '/classes', icon: Users },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppLayout() {
  const [role, setRole] = useState<UserRole>('instructor');
  const location = useLocation();

  // Breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = ['Dashboard', ...pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1))];

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-[220px] border-r border-border bg-card flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">EduFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === '/'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-accent transition-colors"
              activeClassName="bg-accent text-primary font-semibold"
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Role switcher (for demo) */}
        <div className="px-3 pb-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full text-xs p-2 rounded-lg border border-border bg-card text-muted-foreground"
          >
            <option value="instructor">👨‍🏫 Instructor View</option>
            <option value="student">🎓 Student View</option>
            <option value="admin">⚙️ Admin View</option>
          </select>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground">PA</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Prof. Anderson</p>
            <p className="text-xs text-muted-foreground truncate">anderson@edu.com</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="mx-1">›</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>{b}</span>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sessions..." className="pl-9 w-[240px] bg-background" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}
