import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        //adding reference to the user model to get the details of the reciever
        ref : "User",
        required: false,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: false,
    },
    image: {
        type: String,
    },
    Image: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true })
const Message = mongoose.model("Message", messageSchema);
export default Message;
