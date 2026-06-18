"use client";

import { type Conversation } from "@/lib/api";
import { formatPhoneNumber } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChatHeaderProps {
  conversation: Conversation;
  isSyncing?: boolean;
}

export function ChatHeader({
  conversation,
  isSyncing = false,
}: ChatHeaderProps) {
  return (
    <header
      className="flex items-center gap-3 px-4 py-3 shrink-0"
      style={{
        background: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link
        href="/conversations"
        className="md:hidden p-1 rounded transition-colors"
        style={{ color: "var(--text-muted)" }}
        aria-label="Voltar"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <Avatar
        name={conversation.contactName}
        color={conversation.avatarColor}
      />

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {conversation.contactName}
        </p>
        <div className="flex items-center gap-1.5">
          <p
            className="text-xs truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {formatPhoneNumber(conversation.contactPhone)}
          </p>
          {/* Indicador real de sincronização — reflete isFetching do React Query, não é decorativo */}
          <span
            className={`text-[10px] transition-opacity duration-300 ${isSyncing ? "opacity-100" : "opacity-0"}`}
            style={{ color: "var(--accent-light)" }}
            aria-live="polite"
          >
            · sincronizando
          </span>
        </div>
      </div>

      <a
        href={`tel:${conversation.contactPhone}`}
        className="p-2 rounded-lg transition-colors"
        style={{ color: "var(--text-muted)" }}
        aria-label={`Ligar para ${conversation.contactName}`}
      >
        <Phone className="h-4 w-4" />
      </a>
    </header>
  );
}
