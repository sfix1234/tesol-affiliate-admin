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

export function TopbarUser() {
  return (
    <div className="topbar-user">
      <div className="topbar-avatar">運</div>
      <div>
        <b>運営 管理者</b>
        <span>Owner</span>
      </div>
    </div>
  );
}
