import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Group name and member list is required !!!" });
    }
    let conversation;
    if (type === "private") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "private",
        "participants.userId": { $all: [userId, participantId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "private",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          adminId: userId,
        },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    if (!conversation) {
      return res
        .status(400)
        .json({ message: "Conversation type not valid !!!" });
    }

    await conversation.populate([
      { path: "participants.userId", select: "name avatarUrl" },
      {
        path: "seenBy",
        select: "name avatarUrl",
      },
      { path: "lastMessage.senderId", select: "name avatarUrl" },
    ]);
    return res.status(201).json({ conversation });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!!!" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: "name avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "name avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "name avatarUrl",
      });

    const formatted = conversations.map((conversation) => {
      const participants = (conversation.participants || []).map((p) => ({
        _id: p.userId?._id,
        name: p.userId?.name,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));
      return {
        ...conversation.toObject(),
        unReadCounts: conversation.unReadCounts || {},
        participants,
      };
    });
    return res.status(200).json({ conversations: formatted });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!!!" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;

    const query = { conversationId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);

    let nextCursor = null;
    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();
    // messages.reverse();

    return res.status(200).json({ messages, nextCursor });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!!!" });
  }
};

export const getUserConversationForSocketIo = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.log("error when fetch conversation", error);
    return [];
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: "conversation not exit" });
    }

    const last = conversation.lastMessage;
    if (!last) {
      return res
        .status(200)
        .json({ message: "do not have message to mask as seen" });
    }

    if (last.senderId.toString() === userId) {
      return res
        .status(200)
        .json({ message: "Sender do not need mark as seen" });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unReadCounts.${userId}`]: 0 },
      },
      {
        new: true,
      },
    );

    io.to(conversationId).emit("read-message",{
        conversation: updated,
        lastMessage: {
            _id: updated?.lastMessage._id,
            content: updated?.lastMessage.content,
            createdAt: updated?.lastMessage.createdAt,
            sender:{
                _id: updated?.lastMessage.senderId
            }
        }
    });

    return res.status(200).json({
        message: "Marked as seen",
        seenBy: updated?.seenBy || [],
        myUnreadCounts: updated?.unReadCounts[userId] || 0
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal server error !!!"})
  }
};
