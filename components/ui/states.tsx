"use client";

import { AlertCircle, MessageSquare, RefreshCw, Wifi } from "lucide-react";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-t-transparent`}
      style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
      role="status"
      aria-label="Carregando"
    />
  );
}

export function LoadingConversations() {
  return (
    <div className="flex flex-col" aria-busy="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-10 h-10 rounded-full animate-pulse shrink-0"
            style={{ background: "var(--bg-elevated)" }}
          />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between">
              <div
                className="h-3 w-28 rounded animate-pulse"
                style={{ background: "var(--bg-elevated)" }}
              />
              <div
                className="h-3 w-8 rounded animate-pulse"
                style={{ background: "var(--bg-elevated)" }}
              />
            </div>
            <div
              className="h-3 w-40 rounded animate-pulse"
              style={{ background: "var(--bg-elevated)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingMessages() {
  return (
    <div className="flex flex-col gap-2 px-4 py-4" aria-busy="true">
      {[false, true, false, true, true, false].map((isOut, i) => (
        <div
          key={i}
          className={`flex ${isOut ? "justify-end" : "justify-start"}`}
        >
          <div
            className="h-9 rounded-2xl animate-pulse"
            style={{
              width: isOut ? "180px" : "220px",
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
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="p-3 rounded-full" style={{ background: "#f8717120" }}>
        <AlertCircle className="h-5 w-5" style={{ color: "var(--red)" }} />
      </div>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-xs rounded px-2 py-1 transition-colors"
          style={{ color: "var(--accent-light)" }}
        >
          <RefreshCw className="h-3.5 w-3.5" /> Tentar novamente
        </button>
      )}
    </div>
  );
}

export function NetworkError() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <Wifi className="h-6 w-6" style={{ color: "var(--text-muted)" }} />
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Sem conexão com o servidor.
      </p>
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
        <MessageSquare
          className="h-7 w-7"
          style={{ color: "var(--text-muted)" }}
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
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Nenhuma conversa ainda.
        </p>
      )}
    </div>
  );
}

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full text-center p-8">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Nenhuma mensagem ainda.
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
          Selecione uma conversa para começar.
        </p>
      </div>
    </div>
  );
}
