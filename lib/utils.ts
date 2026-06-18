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
 * Formata número de telefone brasileiro para exibição: +55 (11) 95555-4433.
 * Aceita o número com ou sem código do país, com celular (9 dígitos) ou fixo (8).
 * Se o formato não for reconhecido, retorna o valor original sem quebrar a tela.
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Remove o código do país (55) se presente, mantendo DDD + número
  const withoutCountryCode =
    digits.length > 11 && digits.startsWith("55") ? digits.slice(2) : digits;

  const ddd = withoutCountryCode.slice(0, 2);
  const rest = withoutCountryCode.slice(2);

  // Celular: 9 dígitos (ex: 95555-4433) · Fixo: 8 dígitos (ex: 5555-4433)
  if (rest.length === 9) {
    return `+55 (${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  }
  if (rest.length === 8) {
    return `+55 (${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  // Formato não reconhecido: devolve o original para não quebrar a UI
  return phone;
}

/**
 * Identifica mensagens de teste/debug que ficaram no banco da API compartilhada.
 * Em vez de listar cada frase específica (ex: "Offline reload test 123...",
 * "Msg offline 456...", "Teste integracao 789..."), a regra genérica é:
 * mensagem inteira no formato "palavras + número de 12+ dígitos" (timestamp
 * em milissegundos) — assinatura comum de mensagens de teste automatizadas,
 * cobrindo também formatos ainda não vistos no mesmo padrão.
 * Esse filtro é só de exibição — não afeta o que existe no backend.
 */
const TRAILING_TIMESTAMP_PATTERN = /^[a-zà-ú\s]+\s\d{12,}$/i;
const MAX_REASONABLE_LENGTH = 2000;

export function isTestMessage(body: string): boolean {
  const trimmed = body.trim();

  // Mensagem inteira no formato "palavras + número longo de timestamp" = lixo de teste.
  // Exige 12+ dígitos (timestamp em ms tem 13) pra não confundir com telefone informado pelo cliente.
  if (trimmed.length < 80 && TRAILING_TIMESTAMP_PATTERN.test(trimmed)) {
    return true;
  }

  // Texto absurdamente longo e sem espaços normais de frase = provável payload corrompido
  if (trimmed.length > MAX_REASONABLE_LENGTH) {
    const wordCount = trimmed.split(/\s+/).length;
    const avgWordLength = trimmed.length / wordCount;
    if (avgWordLength > 30) return true;
  }

  return false;
}

/**
 * Remove repetições consecutivas de mensagens com mesmo texto e mesma direção
 * (ex: a mesma sugestão de IA enviada várias vezes em sequência). Mantém a
 * primeira ocorrência, com seu timestamp original. Mensagens com o mesmo
 * texto mas intercaladas por outras mensagens diferentes NÃO são removidas —
 * só repetições "coladas" uma na outra, que indicam reenvio acidental.
 */
export function removeDuplicateMessages<
  T extends { body: string; direction: "in" | "out" },
>(messages: T[]): T[] {
  return messages.filter((message, index) => {
    if (index === 0) return true;
    const previous = messages[index - 1];
    const isDuplicate =
      message.body.trim() === previous.body.trim() &&
      message.direction === previous.direction;
    return !isDuplicate;
  });
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
