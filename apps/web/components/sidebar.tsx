"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/", label: "Dashboard", icon: "◫" },
  { href: "/leads", label: "Leads", icon: "◌" },
  { href: "/campaigns", label: "Campaigns", icon: "△" },
  { href: "/dialer", label: "Dialer", icon: "◔" },
  { href: "/recordings", label: "Recordings", icon: "◎" },
  { href: "/scoring", label: "QA Scoring", icon: "★" }
];

const secondaryLinks = [
  { href: "/training", label: "AI Training", icon: "✦" },
  { href: "/supervisor", label: "Supervisor", icon: "⌁" },
  { href: "/billing", label: "Billing", icon: "$" },
  { href: "/settings", label: "Settings", icon: "⚙" },
  { href: "/deployment", label: "Deploy Guide", icon: "⇡" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand-block">
          <div className="brand-mark" />
          <div className="brand-copy">
            <strong>Summit Leads</strong>
            <span>AI CRM & Dialer</span>
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">Operations</div>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? " active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-group">
          <div className="nav-label">Control Layer</div>
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? " active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="identity-card">
          <strong>info</strong>
          <span>Admin</span>
        </div>
      </div>
    </aside>
  );
}
