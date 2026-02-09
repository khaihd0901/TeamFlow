import chatService from "@/services/chatService";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

export const useChatStore = create()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      conversationLoading: false,
      messageLoading: false,
      success: false,
      error: false,

      setActiveConversationId: (id) => set({ activeConversationId: id }),
      clearState: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          conversationLoading: false,
          messageLoading: false,
          success: false,
          error: false,
        });
      },

      chatGetAllConversations: async () => {
        try {
          set({ conversationLoading: true });
          const { conversations } = await chatService.chatGetConversations();
          set({
            conversations,
            conversationLoading: false,
            success: true,
          });
        } catch (err) {
          console.log("error when calling get conversations api", err);
          set({ error: true, conversationLoading: false });
        } finally {
          set({ conversationLoading: false });
        }
      },
      chatGetAllMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const converId = conversationId ?? activeConversationId;
        if (!converId) return;

        const current = messages?.[converId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });
        try {
          const {messages: fetched,cursor} = await chatService.chatGetAllMessages(converId,nextCursor);
          set({messageLoading: false})
          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id
          }));

          set((s) =>{
            const prev = s.messages[converId]?.items || []
            const merged = prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...s.messages,
                [converId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null
                }
              }
            }
          })
        } catch (err) {
          console.log("error when fetch messages",err);
          set({ error: true });
        } finally {
          set({ lading: false });
        }
      },
      chatSendPrivateMessage: async (recipientId,content) =>{
        const {activeConversationId} = get();
        try{
          set({messageLoading: true})
          await chatService.chatSendPrivateMessage(recipientId,content,activeConversationId)
          set({
            messageLoading: false,
          })
          set((s)=>({
            conversations: s.conversations.map((c) => c._id === activeConversationId ? {...c,seenBy: []}: c)
          }))
        }catch(err){
          console.log("error when send private message", err)
        }finally{
          set({messageLoading: false})
        }
      },
      chatSendGroupMessage: async (conversationId,content) =>{
        try{
          set({messageLoading: true})
          await chatService.chatSendGroupMessage(conversationId,content)
          set({
            messageLoading: false,
          })
          set((s)=>({
            conversations: s.conversations.map((c) => c._id === get().activeConversationId ? {...c,seenBy: []}: c)
          }))
        }catch(err){
          console.log("error when send private message", err)
        }finally{
          set({messageLoading: false})
        }
      }
    }),
    {
      name: "chat-storage",
      partialize: (s) => ({ conversations: s.conversations }),
    },
  ),
);
