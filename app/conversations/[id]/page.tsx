import { ChatWindow } from "@/components/chat/chat-window";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col h-dvh md:h-full w-full">
      <ChatWindow conversationId={id} />
    </div>
  );
}
