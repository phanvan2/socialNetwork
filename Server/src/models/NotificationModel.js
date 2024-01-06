import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationShema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now },
});

NotificationShema.statics = {
  createNew(item) {
    return this.create(item);
  },

  removeRequestContactSentNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [
        { senderId: senderId },
        { receiverId: receiverId },
        { type: type },
      ],
    }).exec();
  },

  /**
   * Get by Userid and limit
   * @param {string} userId
   * @param {number} limit
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({ receiverId: userId })
      .sort({ createAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * count all notification unread
   * @param {string} userId
   */
  countNotifUnread(userId) {
    return this.count({
      $and: [{ receiverId: userId }, { isRead: false }],
    }).exec();
  },

  countNotification(userId) {
    return this.count({
      $and: [{ receiverId: userId }],
    }).exec();
  },

  /**
   * read more notification max 10 item one time
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMore(userId, skip, limit) {
    return this.find({ receiverId: userId })
      .sort({ createAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * mark notifications as read
   * @param {string} userId
   * @param {array} targetUsers
   */
  markAllAsRead(userId, targetUsers) {
    return this.updateMany(
      {
        $and: [{ receiverId: userId }, { senderId: { $in: targetUsers } }],
      },
      { isRead: true }
    ).exec();
  },
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact",
  MENTION_YOU: "mention_you_comment",
  REGISTER_SUCCESS: "register_success",
};

export default {
  model: mongoose.model("notification", NotificationShema),
  types: NOTIFICATION_TYPES,
};
