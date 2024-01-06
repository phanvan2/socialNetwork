import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const ViewedSchema = new Schema({
  userId: String,
  postId: String,
  view: { type: Number, default: 1 },
  creatAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: Date.now },
});

ViewedSchema.statics = {
  createNew(data) {
    return this.create(data);
  },
  updateViewed(item) {
    return this.updateOne(
      {
        $and: [{ userId: item.userId }, { postId: item.postId }],
      },
      {
        view: item.view,
        updateAt: Date.now(),
      }
    ).exec();
  },
  getViewedPost(item) {
    return this.findOne({
      $and: [{ postId: item.postId, userId: item.userId }],
    }).exec();
  },
  removeByIdUser(idUser, idPost) {
    return this.deleteOne({
      $and: [{ postId: idPost, userId: idUser }],
    }).exec();
  },
  getViewedByUser(userId) {
    return this.find({ userId: userId }).exec();
  },
  getAllViewed() {
    return this.find().exec();
  },
  getQuanityViewed(idPost) {
    return this.count({ postId: idPost }).exec();
  },
  checkViewed(idPost, idUser) {
    return this.count({
      $and: [{ postId: idPost, userId: idUser }],
    }).exec();
  },
};

export default mongoose.model("viewed", ViewedSchema);
