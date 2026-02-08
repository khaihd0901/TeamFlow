import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message:{
        type: String,
        maxLength: 300,
    },
  },
  { timestamps: true },
);

// Ensure a user cannot send multiple friend requests to the same user
friendRequestSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Indexes for efficient querying
friendRequestSchema.index({ recipient: 1, status: 1 });
friendRequestSchema.index({ requester: 1, status: 1 });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
