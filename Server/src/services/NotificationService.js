import NotificationModel from "../models/notificationModel";
import UserModel from "./../models/UserModel";

const LIMIT_NUMBER_TAKEN = 5;

/**
 * get notification when f5 page
 * just 10 item one time
 * @param {string} currentUserId
 */
let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );
      resolve(notifications);
      let getNotifiContents = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return {
          type: notification.type,
          isRead: notification.isRead,
          _id: sender._id,
          firstName: sender.username,
          avatar: sender.avatar,
        };
      });

      resolve(await Promise.all(getNotifiContents));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * count all notification unread
 * @param {string} currentUserId
 * @returns
 */
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(
        currentUserId
      );
      resolve(notificationsUnread);
    } catch (err) {
      reject(err);
    }
  });
};
let countNotification = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotification(
        currentUserId
      );
      resolve(notificationsUnread);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * read more notification max 10 item one time
 * @param {string} currentUserId
 * @param {number} skipNumberNotification
 * @returns
 */

let readMore = (currentUserId, skipNumberNotification) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotifications = await NotificationModel.model.readMore(
        currentUserId,
        skipNumberNotification,
        LIMIT_NUMBER_TAKEN
      );
      let getNotifiContents = newNotifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return {
          _id: notification._id,
          type: notification.type,
          isRead: notification.isRead,
          idSender: sender[0]._id,
          firstNameSender: sender[0].firstName,
          avatarSender: sender[0].avatar,
          createAt: notification.createAt,
        };
      });
      resolve(await Promise.all(getNotifiContents));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * mark notification as read
 * @param {string} currentUserId
 * @param {array} targetUsers
 * @returns
 */
let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve(true);
    } catch (err) {
      console.log(`error when mark notifications as read: ${error}`);
      reject(false);
    }
  });
};

export default {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead,
  countNotification: countNotification,
};
