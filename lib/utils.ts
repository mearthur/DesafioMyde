/**
 * Formata timestamp para exibição na lista de conversas.
 * Hoje → hora, esta semana → dia abreviado, mais antigo → data.
 */
export function formatConversationTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 7) {
    return date.toLocaleDateString("pt-BR", { weekday: "short" });
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * Formata timestamp para exibição dentro do chat.
 */
export function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata data para separadores de data no chat.
 */
export function formatMessageDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Hoje";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Ontem";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Agrupa mensagens por data para exibir separadores no chat.
 */
export function groupMessagesByDate<T extends { createdAt: string }>(
  messages: T[],
): { date: string; messages: T[] }[] {
  const groups: Record<string, T[]> = {};

  for (const message of messages) {
    const key = new Date(message.createdAt).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(message);
  }

  return Object.entries(groups).map(([, msgs]) => ({
    date: msgs[0].createdAt,
    messages: msgs,
  }));
}

/**
 * Gera iniciais para avatar a partir do nome.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
