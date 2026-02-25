export function CalendarLegend() {
  const items = [
    { label: 'Scheduled', className: 'dot-scheduled' },
    { label: 'In Progress', className: 'dot-in-progress' },
    { label: 'Completed', className: 'dot-completed' },
    { label: 'Cancelled', className: 'dot-cancelled' },
    { label: 'Rescheduled', className: 'dot-rescheduled' },
  ];

  return (
    <div className="flex items-center gap-5 mt-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${item.className}`} />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
