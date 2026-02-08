import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;
    if (from === to) {
      return res.status(400).json({ message: "Cannot add yourself !!!" });
    }

    const userExit = await User.exists({ _id: to });

    if (!userExit) {
      return res.status(500).json({ message: "User not exit !!!" });
    }

    let userA = from.toString();
    let userB = from.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, exitingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friend !!!" });
    }
    if (exitingRequest) {
      return res.status(400).json({ message: "Request exiting !!!" });
    }
    const request = await FriendRequest.create({
      from,
      to,
      message,
    });
    return res
      .status(201)
      .json({ message: "Send request add friend success", request });
  } catch (err) {
    console.error("Error adding friend:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Cannot find request" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission receive this request" });
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);
    const from = await User.findById(request.from)
      .select("_id name avatarUrl")
      .lean();

    return res.status(200).json({
      message: "accept request add friend success",
      newFriend: {
        _id: from?._id,
        name: from?.name,
        avatarUrl: from?.avatarURL,
      },
    });
  } catch (err) {
    console.error("Error accept friend request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request do not exit" });
    }
    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You do not have permission to decline this request",
      });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.sendStatus(204);
  } catch (err) {
    console.error("Error decline friend request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendships = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA","_id name avatarUrl")
      .populate("userB", "_id name avatarUrl")
      .lean();

    if (!friendships.length) {
      return res.status(200).json({ friendships: [] });
    }
    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA,
    );

    return res.status(200).json({friends})
  } catch (err) {
    console.error("Error get all friend request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const populateFields =  '_id email name avatarUrl';
    const[sent,received] = await Promise.all([
        FriendRequest.find({from:userId}).populate("to", populateFields),
        FriendRequest.find({to: userId}).populate('from', populateFields)
    ])
    res.status(200).json({sent, received});

  } catch (err) {
    console.error("Error get all friend:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
