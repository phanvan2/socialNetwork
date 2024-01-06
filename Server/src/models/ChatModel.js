import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  senderId: String,
  receiverId: String,
  messageType: { type: String, default: "text" }, // file || text|| image
  text: String,
  creaetAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: Date.now },
});

ChatSchema.statics = {
  createNew(data) {
    return this.create(data);
  },
  getChatByReceiver(userId, receiverId) {
    return this.find({
      $or: [
        { $and: [{ senderId: userId }, { receiverId: receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: userId }] },
      ],
    })
      .sort({ creatAt: -1 })
      .exec();
  },
};

export default mongoose.model("chat", ChatSchema);
