# Inbox de Atendimento — Desafio Frontend

Painel de atendimento via WhatsApp com sugestões de IA. Construído em Next.js 15 (App Router), React 19, TypeScript e Tailwind CSS 4.

## Como rodar

```bash
# 1. Configure a URL da API
cp .env.example .env.local

# 2. Instale as dependências
npm install

# 3. Rode em desenvolvimento
npm run dev
# → http://localhost:3000

```

> A URL da API já vem preenchida no `.env.example`. Basta copiar para `.env.local`.

---

## Estrutura de pastas

```
app/
  layout.tsx                    # Root layout (Server Component)
  page.tsx                      # Redirect para /conversations
  globals.css                   # Design tokens + animações globais
  providers.tsx                 # QueryClientProvider (Client)
  conversations/
    layout.tsx                  # Layout dois painéis: sidebar + chat
    page.tsx                    # Tela "selecione uma conversa"
    [id]/
      page.tsx                  # Página do chat individual

components/
  conversations/
    conversation-list.tsx       # Lista completa com busca e polling
    conversation-item.tsx       # Item individual com link ativo
    search-bar.tsx              # Input de busca filtrado
  chat/
    chat-window.tsx             # Container de mensagens
    chat-header.tsx             # Header com nome, telefone e status
    message-bubble.tsx          # Bolha de mensagem (in/out)
    message-input.tsx           # Input + botão de sugestão de IA
  ui/
    states.tsx                  # Loading skeletons, erros e vazios
    avatar.tsx                  # Avatar com iniciais e cor dinâmica

lib/
  api.ts                        # Cliente HTTP Axios e tipos (fornecido)
  queries.ts                    # Hooks React Query centralizados
  utils.ts                      # Formatação de datas, telefone e filtros
```

---

## Arquitetura: Server vs Client Components

O critério foi simples: **só é Client Component se precisar de estado, evento ou hook de browser**.

| Componente                    | Tipo   | Motivo                                                     |
| ----------------------------- | ------ | ---------------------------------------------------------- |
| `app/layout.tsx`              | Server | Só estrutura HTML e metadados                              |
| `app/page.tsx`                | Server | Só faz `redirect()`                                        |
| `conversations/layout.tsx`    | Server | Estrutura estática de dois painéis                         |
| `conversations/page.tsx`      | Server | Conteúdo estático                                          |
| `conversations/[id]/page.tsx` | Server | Extrai `id` dos params e passa pro Client                  |
| `ConversationList`            | Client | `useState` na busca, `useQuery` com polling                |
| `ConversationItem`            | Client | `useParams` pra detectar item ativo                        |
| `SearchBar`                   | Client | `useState` no input                                        |
| `ChatWindow`                  | Client | `useRef` para scroll, polling, animação de novas mensagens |
| `MessageInput`                | Client | Estado do texto, `useMutation`, auto-resize                |
| `ChatHeader`                  | Client | Recebe `isSyncing` do `ChatWindow`                         |
| `MessageBubble`               | Client | Recebe prop `isNew` para animação de entrada               |

---

## Data fetching e estado

### Por que polling e não WebSocket ou SSE?

A API fornecida é REST pura — sem endpoint de stream ou suporte a WebSocket. Polling com `refetchInterval` do React Query foi a escolha certa para esse contexto porque:

- Zero infraestrutura adicional além do que já estava configurado
- React Query gerencia cache, deduplicação e background refetch automaticamente
- Simples de debugar: cada refetch é uma requisição HTTP visível no DevTools

**Frequências escolhidas:**

- Lista de conversas: `5s` — menos urgente
- Mensagens do chat ativo: `3s` — precisa de mais responsividade

Para produção, a evolução natural seria **SSE** (`EventSource`) — push server-side, sem polling desnecessário, latência menor. WebSocket só faria sentido se fosse preciso comunicação bidirecional em tempo real (typing indicators, presença).

### Optimistic update no envio de mensagem

```
onMutate
  → cancela refetch em andamento (evita race condition)
  → injeta mensagem temporária com id "optimistic-{timestamp}-{random}"
  → atualiza lastMessage na lista de conversas

onError
  → reverte para o snapshot anterior (rollback)

onSettled
  → invalida as queries para sincronizar com o servidor
```

A mensagem optimistic fica com `opacity: 0.7` e ícone de relógio no lugar do check, comunicando visualmente o estado de "enviando".

### Indicador de sincronização

O `ChatHeader` recebe `isSyncing` calculado como `isFetching && !isLoading` do React Query — aparece "· sincronizando" ao lado do telefone a cada refetch em background. É 100% real, não decorativo.

---

## Decisões de UX

- **Visual SaaS próprio**: paleta escura indigo/roxo (`#0f1117`, `#1e2333`, `#6366f1`), afastada intencionalmente do verde do WhatsApp — o produto precisa ter identidade própria
- **Animação seletiva**: o histórico aparece instantâneo ao abrir a conversa. Só mensagens genuinamente novas (enviadas ou recebidas via polling depois de abrir) entram com animação de slide — controlado por um `Set` de IDs já conhecidos no `ChatWindow`
- **Scroll inteligente**: só desce automaticamente se o usuário estiver nos últimos 200px — não interrompe quem está lendo histórico mais antigo
- **Shift+Enter**: nova linha sem enviar, comportamento esperado por quem usa esse tipo de ferramenta
- **Status de mensagem**: ✓ enviada · ✓✓ entregue · ✓✓ azul lida · relógio em andamento
- **Separadores de data**: "Hoje", "Ontem" e data completa, agrupados em `utils.ts`
- **Selo de IA**: ao usar "Sugerir", aparece um selo indicando se a sugestão veio de `openai` ou `mock`. Some automaticamente se o texto for editado manualmente
- **Filtro de mensagens de teste**: a API compartilhada tem dados de seed sujos de outros usuários (ex: "Offline reload test 1781...", "Teste integracao 1781..."). Um filtro de exibição em `utils.ts` detecta o padrão "palavras + número de 13 dígitos (timestamp em ms)" e esconde essas mensagens. Não afeta nada no backend
- **Telefone formatado**: `5511955554433` → `+55 (11) 95555-4433`, com suporte a celular (9 dígitos) e fixo (8 dígitos)
- **Acessibilidade**: `role="log"` + `aria-live="polite"` na área de mensagens, `aria-current="page"` no item ativo, `aria-label` descritivo em cada conversa, foco visível em todos os interativos, `prefers-reduced-motion` respeitado no CSS global

---

## Trade-offs conscientes

**Header depende de duas queries:** o `ChatHeader` usa `useConversations()` para buscar os dados do contato, mesmo já estando na rota `/conversations/[id]`. As duas queries (`messages` e `conversations`) disparam em paralelo — não é waterfall de rede — mas o header pode ficar em skeleton brevemente se `messages` resolver antes. Com mais tempo, resolveria retornando os dados do contato dentro do endpoint de mensagens, ou cacheando no Server Component antes de passar pro Client.

**`lucide-react` adicionado como dependência extra** — não estava no `package.json` original. Necessário para todos os ícones da interface.

---

## O que faria com mais tempo

1. **SSE** para substituir o polling no chat ativo
2. **Testes** com Vitest + Testing Library nos hooks e componentes de estado
3. **Virtualized list** (TanStack Virtual) para conversas e históricos longos
4. **Infinite scroll** no chat para carregar mensagens mais antigas ao scrollar para cima
5. **Toast notifications** para feedback de erros de envio além do estado inline
6. **Marca de leitura** — endpoint para zerar `unread` ao abrir a conversa
7. **Autenticação** — `/me` não tem auth hoje; em produção teria JWT/session
8. **PWA** — manifest + service worker para instalar como app no celular
