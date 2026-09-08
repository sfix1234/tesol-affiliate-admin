import type { ReactNode } from "react";

export function Topbar({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="pagetitle">
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>
      <div className="topbar-right">{children}</div>
    </header>
  );
}
