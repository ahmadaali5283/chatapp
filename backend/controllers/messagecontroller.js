import Message from "../models/Message.js";
import User from "../models/users.js";

const RAG_BASE = process.env.RAG_SERVICE_URL || "http://localhost:8001";

// Fire-and-forget: embed the message in ChromaDB without blocking the response
function embedMessage(msg) {
  fetch(`${RAG_BASE}/ingest-one`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id:        msg._id.toString(),
      senderId:   msg.sender.toString(),
      recieverId: msg.receiver.toString(),
      text:       msg.text || "",
      createdAt:  msg.createdAt ? msg.createdAt.toISOString() : "",
    }),
  }).catch((err) =>
    console.error("[RAG] Failed to embed message:", err.message)
  );
}

export const getusersforsidebar = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("fullName email profilePic");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }   
};
export const getmessagesbetweenusers = async (req, res) => {
    try {
        const otherUserId = req.params.id;
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages between users:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendmessage = async (req, res) => { 
    try {
        const { image, text } = req.body;
        const receiverId = req.query.receiverId;// Assuming you pass receiverId as a query parameter
        const senderid=req.user._id;// Assuming you have the sender's ID from the authenticated user
        let imageurl;
        if (image) {
            const response = await cloudinary.uploader.upload(image)
            imageurl = response.secure_url;
        }
        const newMessage = new Message({
            sender: senderid,
            receiver: receiverId, 
            text,
            image: imageurl
        });
        await newMessage.save();
        embedMessage(newMessage); // non-blocking: embed into ChromaDB for RAG
        res.status(201).json(newMessage); 
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
