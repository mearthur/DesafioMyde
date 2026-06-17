"use client";

import { useState, useMemo } from "react";
import { useConversations, useMe } from "@/lib/queries";
import { ConversationItem } from "./conversation-item";
import { SearchBar } from "./search-bar";
import { Avatar } from "@/components/ui/avatar";
import {
  LoadingConversations,
  ErrorState,
  EmptyConversations,
} from "@/components/ui/states";
import { RefreshCw } from "lucide-react";

export function ConversationList() {
  const [search, setSearch] = useState("");
  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useConversations();
  const { data: me } = useMe();

  const filtered = useMemo(() => {
    if (!conversations) return [];
    const q = search.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.contactName.toLowerCase().includes(q) ||
        c.contactPhone.includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const totalUnread = useMemo(
    () => conversations?.reduce((acc, c) => acc + c.unread, 0) ?? 0,
    [conversations],
  );

  return (
    <aside
      className="flex flex-col h-full w-full"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          {me ? (
            <Avatar name={me.name} color="var(--accent)" size="sm" />
          ) : (
            <div
              className="w-8 h-8 rounded-full animate-pulse"
              style={{ background: "var(--bg-active)" }}
            />
          )}
          <div>
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {me?.name ?? "Atendente"}
            </p>
            {me?.role && (
              <p
                className="text-xs leading-tight"
                style={{ color: "var(--text-muted)" }}
              >
                {me.role}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalUnread > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: "var(--accent-dim)",
                color: "var(--accent-light)",
              }}
            >
              {totalUnread} não lidas
            </span>
          )}
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            aria-label="Atualizar"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <SearchBar value={search} onChange={setSearch} />

      {!isLoading && !isError && conversations && (
        <div className="px-4 py-2 shrink-0">
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {search
              ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`
              : `${conversations.length} conversa${conversations.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto scrollbar-thin"
        role="list"
        aria-label="Conversas"
      >
        {isLoading ? (
          <LoadingConversations />
        ) : isError ? (
          <ErrorState
            message="Não foi possível carregar as conversas."
            onRetry={() => refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyConversations query={search || undefined} />
        ) : (
          filtered.map((c) => (
            <div key={c.id} role="listitem">
              <ConversationItem conversation={c} />
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
