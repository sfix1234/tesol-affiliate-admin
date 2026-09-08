"use client";

import { useRouter } from "next/navigation";
import { CalendarIcon } from "./icons";

export function MonthSelect({ months, selected }: { months: string[]; selected: string }) {
  const router = useRouter();

  return (
    <div className="pill" style={{ paddingRight: 6 }}>
      <CalendarIcon width={14} height={14} />
      <select
        value={selected}
        onChange={(e) => router.push(`/?month=${e.target.value}`)}
        style={{ border: "none", background: "transparent", font: "inherit", color: "inherit", cursor: "pointer" }}
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}月
          </option>
        ))}
      </select>
    </div>
  );
}
