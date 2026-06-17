import { ConversationList } from "@/components/conversations/conversation-list";

/**
 * Layout de dois painéis (sidebar + chat).
 * Server Component — renderiza a estrutura, ConversationList é Client Component.
 *
 * Responsividade:
 * - Mobile: apenas um painel visível por vez (sidebar ou chat)
 * - Desktop (md+): ambos visíveis lado a lado
 */
export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* Sidebar - lista de conversas */}
      <div
        className="
        w-full md:w-[380px] lg:w-[420px] shrink-0
        flex flex-col
        md:border-r md:border-[#2a3942]
      "
      >
        <ConversationList />
      </div>

      {/* Área do chat */}
      <main className="hidden md:flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
