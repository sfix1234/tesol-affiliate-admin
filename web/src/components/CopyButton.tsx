"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyButton({ value, small }: { value: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <button
      type="button"
      className={`copybtn${small ? " sm" : ""}${copied ? " copied" : ""}`}
      onClick={handleCopy}
      title={value}
      aria-label="リンクをコピー"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
