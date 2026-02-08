import chatService from "@/services/chatService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,
      success: false,
      error: false,

      setActiveConversationId: (id) => set({ activeConversationId: id }),
      clearState: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
          success: false,
          error: false,
        });
      },

      chatGetAllConversations: async () => {
        try {
          set({ loading: true });
          const { conversations } = await chatService.chatGetConversations();
          set({
            conversations,
            loading: false,
            success: true,
          });
        } catch (err) {
          console.log("error when calling get conversations api", err);
          set({ error: true, loading: false });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (s) => ({ conversations: s.conversations }),
    },
  ),
);
