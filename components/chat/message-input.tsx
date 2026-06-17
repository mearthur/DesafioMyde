"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useSendMessage, useAiSuggest } from "@/lib/queries";

export function MessageInput({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMutation = useSendMessage(conversationId);
  const aiSuggest = useAiSuggest();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
    setText("");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [text, sendMutation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleAiSuggest = useCallback(async () => {
    try {
      const result = await aiSuggest.mutateAsync(conversationId);
      setText(result.suggestion);
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      });
    } catch {
      /* estado de erro já tratado pela mutation */
    }
  }, [conversationId, aiSuggest]);

  return (
    <div
      className="px-3 py-3 shrink-0"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {sendMutation.isError && (
        <div
          className="mb-2 px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: "#f8717115",
            color: "var(--red)",
            border: "1px solid #f8717125",
          }}
          role="alert"
        >
          Falha ao enviar. Tente novamente.
        </div>
      )}
      {aiSuggest.isError && (
        <div
          className="mb-2 px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: "#fbbf2415",
            color: "#fbbf24",
            border: "1px solid #fbbf2425",
          }}
          role="alert"
        >
          Não foi possível gerar sugestão.
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          onClick={handleAiSuggest}
          disabled={aiSuggest.isPending}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "var(--accent-dim)",
            color: "var(--accent-light)",
            border: "1px solid var(--accent)22",
          }}
          aria-label="Sugerir com IA"
        >
          {aiSuggest.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            {aiSuggest.isPending ? "Gerando..." : "Sugerir"}
          </span>
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem"
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 rounded-xl text-sm leading-snug outline-none transition-all scrollbar-thin"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            maxHeight: "120px",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)44")
          }
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          aria-label="Mensagem"
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || sendMutation.isPending}
          className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--accent)", color: "#fff" }}
          aria-label="Enviar mensagem"
        >
          {sendMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      <p
        className="text-[10px] mt-1.5 text-right"
        style={{ color: "var(--text-muted)" }}
      >
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  );
}
