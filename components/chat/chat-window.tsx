"use client";

import { useEffect, useRef, useState } from "react";
import { useMessages, useConversations } from "@/lib/queries";
import { MessageBubble } from "./message-bubble";
import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { LoadingMessages, ErrorState, EmptyChat } from "@/components/ui/states";
import {
  formatMessageDate,
  groupMessagesByDate,
  isTestMessage,
  removeDuplicateMessages,
} from "@/lib/utils";

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const {
    data: messages,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useMessages(conversationId);
  const { data: conversations } = useConversations();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const knownIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedRef = useRef(false);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  const conversation = conversations?.find((c) => c.id === conversationId);

  // Reset ao trocar de conversa
  useEffect(() => {
    knownIdsRef.current = new Set();
    hasLoadedRef.current = false;
    setAnimatingIds(new Set());
  }, [conversationId]);

  useEffect(() => {
    if (!messages) return;

    // ─── Primeira carga: histórico aparece de uma vez, sem animação ───
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      messages.forEach((m) => knownIdsRef.current.add(m.id));
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      return;
    }

    // ─── Depois disso: só anima mensagens realmente novas (enviadas ou recebidas via polling) ───
    const incoming = messages.filter((m) => !knownIdsRef.current.has(m.id));
    if (incoming.length === 0) return;

    incoming.forEach((m) => knownIdsRef.current.add(m.id));
    const ids = new Set(incoming.map((m) => m.id));
    setAnimatingIds((prev) => new Set([...prev, ...ids]));

    setTimeout(() => {
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }, 400);

    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        requestAnimationFrame(() =>
          bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        );
      }
    }
  }, [messages]);

  const visibleMessages = removeDuplicateMessages(
    messages?.filter((m) => !isTestMessage(m.body)) ?? [],
  );
  const grouped = groupMessagesByDate(visibleMessages);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-base)" }}
    >
      {conversation ? (
        <ChatHeader
          conversation={conversation}
          isSyncing={isFetching && !isLoading}
        />
      ) : (
        <div
          className="h-[57px] shrink-0 animate-pulse"
          style={{
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border)",
          }}
        />
      )}

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5 scrollbar-thin"
        role="log"
        aria-label="Histórico de mensagens"
        aria-live="polite"
        aria-relevant="additions"
      >
        {isLoading ? (
          <LoadingMessages />
        ) : isError ? (
          <ErrorState
            message="Não foi possível carregar as mensagens."
            onRetry={() => refetch()}
          />
        ) : !visibleMessages.length ? (
          <EmptyChat />
        ) : (
          grouped.map((group) => (
            <div key={group.date} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-center my-3">
                <div
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatMessageDate(group.date)}
                  </span>
                </div>
              </div>
              {group.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isNew={animatingIds.has(message.id)}
                />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      <MessageInput conversationId={conversationId} />
    </div>
  );
}
