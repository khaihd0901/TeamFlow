import Conversation from "../models/Conversation.js";

export const checkGroupMemberShip = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found !!!" });
    }
    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You do not match this group !!!" });
    }
    req.conversation = conversation;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'})
  }
};
