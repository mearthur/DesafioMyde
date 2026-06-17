"use client";

import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="px-3 py-2"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="relative flex items-center">
        <Search
          className="absolute left-3 h-3.5 w-3.5 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar conversa..."
          className="w-full h-8 pl-8 pr-8 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
          aria-label="Buscar conversas"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2 rounded"
            style={{ color: "var(--text-muted)" }}
            aria-label="Limpar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
