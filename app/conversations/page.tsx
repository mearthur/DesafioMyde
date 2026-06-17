import { NoChatSelected } from "@/components/ui/states";

/**
 * Server Component — exibido quando nenhuma conversa está selecionada.
 * No mobile, essa tela fica oculta (o sidebar ocupa a tela toda).
 */
export default function ConversationsPage() {
  return <NoChatSelected />;
}
