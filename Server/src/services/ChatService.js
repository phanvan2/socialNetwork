import ChatModel from "../models/ChatModel";
import UserModel from "../models/UserModel";

let addNew = (userId, receiverId, data) => {
  return new Promise(async (resolve, reject) => {
    let item = {
      senderId: userId,
      receiverId: receiverId,
      messageType: data.messageType,
      text: data.text,
    };
    let result = await ChatModel.createNew(item);
    if (result) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

let getChatByReceiver = (UserId, receiverId) => {
  return new Promise(async (resolve, reject) => {
    let result = await ChatModel.getChatByReceiver(UserId, receiverId);
    if (result) {
      resolve(result);
    } else {
      resolve([]);
    }
  });
};
export default {
  addNew: addNew,
  getChatByReceiver,
};
