"use client";

import { Check, CheckCheck, Clock } from "lucide-react";
import { type Message } from "@/lib/api";
import { formatMessageTime } from "@/lib/utils";

function StatusIcon({
  status,
  isOptimistic,
}: {
  status: Message["status"];
  isOptimistic: boolean;
}) {
  if (isOptimistic)
    return (
      <Clock
        className="h-3 w-3"
        style={{ color: "var(--text-muted)" }}
        aria-label="Enviando"
      />
    );
  if (status === "read")
    return (
      <CheckCheck
        className="h-3 w-3"
        style={{ color: "#60a5fa" }}
        aria-label="Lida"
      />
    );
  if (status === "delivered")
    return (
      <CheckCheck
        className="h-3 w-3"
        style={{ color: "var(--text-muted)" }}
        aria-label="Entregue"
      />
    );
  return (
    <Check
      className="h-3 w-3"
      style={{ color: "var(--text-muted)" }}
      aria-label="Enviada"
    />
  );
}

export function MessageBubble({
  message,
  isNew = false,
}: {
  message: Message;
  isNew?: boolean;
}) {
  const isOut = message.direction === "out";
  const isOptimistic = message.id.startsWith("optimistic-");

  return (
    <div
      className={`flex ${isOut ? "justify-end" : "justify-start"} ${isNew ? (isOut ? "msg-animate-out" : "msg-animate-in") : ""}`}
      aria-label={`Mensagem ${isOut ? "enviada" : "recebida"}`}
    >
      <div
        className="relative max-w-[70%] min-w-[72px] px-3 py-2 rounded-2xl"
        style={{
          background: isOut ? "var(--accent-msg)" : "var(--msg-in)",
          border: `1px solid ${isOut ? "#4338ca30" : "var(--border)"}`,
          opacity: isOptimistic ? 0.7 : 1,
          transition: "opacity 0.2s",
          borderTopRightRadius: isOut ? "4px" : "16px",
          borderTopLeftRadius: isOut ? "16px" : "4px",
        }}
      >
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-8"
          style={{ color: "var(--text-primary)" }}
        >
          {message.body}
        </p>

        <div className="flex items-center justify-end gap-1 mt-0.5">
          <time
            className="text-[10px]"
            style={{ color: "var(--text-muted)" }}
            dateTime={message.createdAt}
          >
            {formatMessageTime(message.createdAt)}
          </time>
          {isOut && (
            <StatusIcon status={message.status} isOptimistic={isOptimistic} />
          )}
        </div>
      </div>
    </div>
  );
}
