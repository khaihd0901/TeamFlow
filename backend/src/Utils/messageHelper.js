export const updateConversationAfterCreateMessage = (conversation,message,senderId)=>{
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createAt,
        lastMessage:{
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt
        }
    });

    conversation.participants.forEach((p)=>{
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const prevCount = conversation.unReadCounts.get(memberId) || 0;
        conversation.unReadCounts.set(memberId, isSender ? 0 : prevCount + 1)
    })
}