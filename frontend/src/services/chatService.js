import api from "@/lib/api";

const pageLimit = 20;
const chatGetConversations = async () => {
  const res = await api.get(`/conversation`);
  return res.data;
};

const chatGetAllMessages = async (id, cursor) => {
  const res = await api.get(
    `/conversation/${id}/messages?limit=${pageLimit}&cursor=${cursor}`,
  );
  return { messages: res.data.messages, cursor: res.data.nextCursor };
};
const chatSendPrivateMessage = async (recipientId, content, conversationId) => {
  const res = await api.post(`/message/private`, {
    recipientId,
    content,
    conversationId,
  });
  return res.data.message;
};
const chatSendGroupMessage = async (conversationId, content) => {
  const res = await api.post(`/message/group`, { conversationId,content });
  return res.data.message;
};

const chatMarkAsSeen = async (id) =>{
  const res = await api.patch(`/conversation/${id}/seen`);
  return res.data
}
const chatService = {
  chatGetConversations,
  chatGetAllMessages,
  chatSendPrivateMessage,
  chatSendGroupMessage,
  chatMarkAsSeen,
};
export default chatService;
