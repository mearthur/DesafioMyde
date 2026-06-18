"use client";

import { AlertCircle, MessageSquare, RefreshCw, Search } from "lucide-react";

export function LoadingConversations() {
  return (
    <div
      className="flex flex-col"
      aria-busy="true"
      aria-label="Carregando conversas"
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-soft)" }}
        >
          <div
            className="w-10 h-10 rounded-full animate-pulse shrink-0"
            style={{ background: "var(--bg-elevated)" }}
          />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between">
              <div
                className="h-3 rounded animate-pulse"
                style={{ width: "30%", background: "var(--bg-elevated)" }}
              />
              <div
                className="h-3 w-8 rounded animate-pulse"
                style={{ background: "var(--bg-elevated)" }}
              />
            </div>
            <div
              className="h-3 rounded animate-pulse"
              style={{ width: "60%", background: "var(--bg-elevated)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingMessages() {
  return (
    <div
      className="flex flex-col gap-2 px-4 py-4"
      aria-busy="true"
      aria-label="Carregando mensagens"
    >
      {[false, true, false, true, true, false].map((isOut, i) => (
        <div
          key={i}
          className={`flex ${isOut ? "justify-end" : "justify-start"}`}
        >
          <div
            className="h-9 rounded-2xl animate-pulse"
            style={{
              width: isOut ? "170px" : "210px",
              background: "var(--bg-elevated)",
              animationDelay: `${i * 80}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  message = "Não foi possível carregar.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 p-8 text-center h-full"
      role="alert"
    >
      <div className="p-3 rounded-full" style={{ background: "#f8717118" }}>
        <AlertCircle
          className="h-5 w-5"
          style={{ color: "var(--red)" }}
          aria-hidden="true"
        />
      </div>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-xs rounded-lg px-3 py-1.5 transition-colors"
          style={{
            color: "var(--accent-light)",
            background: "var(--accent-dim)",
          }}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyConversations({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center h-full">
      <div
        className="p-4 rounded-full"
        style={{ background: "var(--bg-elevated)" }}
      >
        <Search
          className="h-6 w-6"
          style={{ color: "var(--text-muted)" }}
          aria-hidden="true"
        />
      </div>
      {query ? (
        <>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Nenhum resultado
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Nada encontrado para &ldquo;{query}&rdquo;
          </p>
        </>
      ) : (
        <>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Sem conversas
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            As conversas aparecerão aqui quando chegarem.
          </p>
        </>
      )}
    </div>
  );
}

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full text-center p-8">
      <div
        className="p-4 rounded-full"
        style={{ background: "var(--bg-elevated)" }}
      >
        <MessageSquare
          className="h-6 w-6"
          style={{ color: "var(--text-muted)" }}
          aria-hidden="true"
        />
      </div>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Nenhuma mensagem ainda.
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Envie a primeira mensagem para começar.
      </p>
    </div>
  );
}

export function NoChatSelected() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 h-full text-center p-12"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="p-6 rounded-2xl"
        style={{ background: "var(--bg-elevated)" }}
      >
        <MessageSquare
          className="h-10 w-10"
          style={{ color: "var(--text-muted)" }}
          aria-hidden="true"
        />
      </div>
      <div>
        <p
          className="text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Inbox de Atendimento
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Selecione uma conversa na lista para começar a atender.
        </p>
      </div>
    </div>
  );
}
