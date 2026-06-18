"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type Conversation } from "@/lib/api";
import { formatConversationTime } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

export function ConversationItem({
  conversation,
}: {
  conversation: Conversation;
}) {
  const params = useParams();
  const isActive = params?.id === conversation.id;

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
      style={{
        background: isActive ? "var(--bg-active)" : "transparent",
        borderBottom: "1px solid var(--border-soft)",
        focusRingColor: "var(--accent)",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Conversa com ${conversation.contactName}${conversation.unread > 0 ? `, ${conversation.unread} não lidas` : ""}. Última mensagem: ${conversation.lastMessage}`}
    >
      <Avatar
        name={conversation.contactName}
        color={conversation.avatarColor}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-sm font-medium truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {conversation.contactName}
          </span>
          <span
            className="text-xs shrink-0"
            style={{
              color:
                conversation.unread > 0
                  ? "var(--accent-light)"
                  : "var(--text-muted)",
            }}
          >
            {formatConversationTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className="text-xs truncate leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {conversation.lastMessage}
          </p>
          {conversation.unread > 0 && (
            <span
              className="shrink-0 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1"
              style={{ background: "var(--accent)", color: "#fff" }}
              aria-label={`${conversation.unread} não lidas`}
            >
              {conversation.unread > 99 ? "99+" : conversation.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
