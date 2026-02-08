import mongoose from "mongoose";
const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const lastMessageSchema = new mongoose.Schema(
  {
    _id: String,
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    content: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
    },
  },
  { _id: false },
);

const conversationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["private", "group"],
    required: true,
  },
  participants: {
    type: [participantSchema],
    required: true,
  },
  group: {
    type: [groupSchema],
    required: true,
  },
  lastMessageAt: {
    type: Date,
    default: null,
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastMessage: {
    type: lastMessageSchema,
    default: null,
  },
  unReadCounts: {
    type: Map,
    of: Number,
    default: {},
  }
},{
    timestamps: true
});

conversationSchema.index({
    "participants.userId": 1,
    "lastMessageAt": -1
})

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
