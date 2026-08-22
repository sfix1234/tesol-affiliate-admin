import Link from "next/link";
import {
  GridIcon,
  UsersIcon,
  LinkIcon,
  WalletIcon,
  SettingsIcon,
} from "./icons";

type NavKey = "dashboard" | "influencers" | "links" | "payouts" | "settings";

const mainNav: { key: NavKey; href: string; label: string; icon: typeof GridIcon }[] = [
  { key: "dashboard", href: "/", label: "ダッシュボード", icon: GridIcon },
  { key: "influencers", href: "/influencers", label: "インフルエンサー", icon: UsersIcon },
  { key: "links", href: "/links", label: "リンク管理", icon: LinkIcon },
];

const opsNav: { key: NavKey; href: string; label: string; icon: typeof GridIcon }[] = [
  { key: "payouts", href: "/payouts", label: "精算・支払い", icon: WalletIcon },
  { key: "settings", href: "/settings", label: "設定", icon: SettingsIcon },
];

export function Sidebar({ active }: { active: NavKey }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">TS</div>
        <div className="brand-text">
          <b>オンラインTESOL協会</b>
          <span>アフィリエイト管理ツール</span>
        </div>
      </div>

      <div className="navsection">メイン</div>
      {mainNav.map(({ key, href, label, icon: IconComp }) => (
        <Link
          key={key}
          href={href}
          className={`navitem${active === key ? " active" : ""}`}
        >
          <IconComp />
          {label}
        </Link>
      ))}

      <div className="navsection">運用</div>
      {opsNav.map(({ key, href, label, icon: IconComp }) => (
        <Link
          key={key}
          href={href}
          className={`navitem${active === key ? " active" : ""}`}
        >
          <IconComp />
          {label}
        </Link>
      ))}

      <div className="navfoot">
        <div className="navavatar">運</div>
        <div className="navfoot-text">
          <b>運営 管理者</b>
          <span>admin@online-tesol.jp</span>
        </div>
      </div>
    </aside>
  );
}
