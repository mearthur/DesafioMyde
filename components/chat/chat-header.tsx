"use client";

import { type Conversation } from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ChatHeader({ conversation }: { conversation: Conversation }) {
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
        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {conversation.contactPhone}
        </p>
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
