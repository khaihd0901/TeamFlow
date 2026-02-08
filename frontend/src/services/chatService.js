import api from "@/lib/api";

const chatGetConversations = async () => {
  const res = await api.get(`conversation/`);
  return res.data;
};

const chatService = {
  chatGetConversations,
};
export default chatService;
