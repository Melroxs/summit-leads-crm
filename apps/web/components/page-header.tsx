interface PageHeaderProps {
  title: string;
  subtitle: string;
  rightSlot?: React.ReactNode;
}

export function PageHeader({ title, subtitle, rightSlot }: PageHeaderProps) {
  return (
    <div className="topbar">
      <div className="title-stack">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        {rightSlot}
        <div className="status-pill">
          <span className="status-dot" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
}

