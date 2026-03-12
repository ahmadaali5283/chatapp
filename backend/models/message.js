import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        //adding reference to the user model to get the details of the reciever
        ref : "User",
        required: true, 
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
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
