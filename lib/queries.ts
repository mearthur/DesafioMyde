import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getMe,
  getMessages,
  sendMessage,
  suggestReply,
  type Message,
} from "./api";

// ─── Query Keys ───────────────────────────────────────────
export const queryKeys = {
  me: ["me"] as const,
  conversations: ["conversations"] as const,
  messages: (id: string) => ["messages", id] as const,
};

// ─── Queries ──────────────────────────────────────────────
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    staleTime: Infinity, // perfil não muda durante a sessão
  });
}

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: getConversations,
    refetchInterval: 5_000, // polling a cada 5s
    staleTime: 2_000,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId),
    refetchInterval: 3_000, // polling mais frequente no chat ativo
    staleTime: 1_000,
    enabled: !!conversationId,
  });
}

// ─── Mutations ────────────────────────────────────────────
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId, text),

    // Optimistic update: mensagem aparece imediatamente
    onMutate: async (text: string) => {
      // Cancela refetch em andamento para não sobrescrever o optimistic
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages(conversationId),
      });

      const previousMessages = queryClient.getQueryData<Message[]>(
        queryKeys.messages(conversationId),
      );

      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        direction: "out",
        body: text,
        status: "sent",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        queryKeys.messages(conversationId),
        (old) => [...(old ?? []), optimisticMessage],
      );

      // Atualiza lastMessage na lista de conversas
      queryClient.setQueryData(queryKeys.conversations, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: text,
                lastMessageAt: new Date().toISOString(),
                unread: 0,
              }
            : conv,
        );
      });

      return { previousMessages };
    },

    // Em caso de erro, reverte o optimistic update
    onError: (_err, _text, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          queryKeys.messages(conversationId),
          context.previousMessages,
        );
      }
    },

    // Após sucesso ou erro, sincroniza com o servidor
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export function useAiSuggest() {
  return useMutation({
    mutationFn: (conversationId: string) => suggestReply(conversationId),
  });
}
