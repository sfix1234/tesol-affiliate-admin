"use client";

import { useState } from "react";

export function Toggle({
  defaultOn = false,
  checked,
  onChange,
}: {
  defaultOn?: boolean;
  checked?: boolean;
  onChange?: (on: boolean) => void;
}) {
  const [uncontrolledOn, setUncontrolledOn] = useState(defaultOn);
  const on = checked ?? uncontrolledOn;
  return (
    <button
      type="button"
      className={`toggle${on ? " on" : ""}`}
      role="switch"
      aria-checked={on}
      onClick={() => {
        if (onChange) onChange(!on);
        else setUncontrolledOn((v) => !v);
      }}
    />
  );
}
