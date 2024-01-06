import ContactModel from "./../models/ContactModel";
import UserModel from "../models/UserModel";
import NotificationModel from "./../models/notificationModel";

import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 10;

let findUserContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    console.log("contact service");
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact_item) => {
      deprecatedUserIds.push(contact_item.userId);
      deprecatedUserIds.push(contact_item.contactId);
    });
    //  console.log(contactsByUser);
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    // console.log(contactsByUser);

    let users = await UserModel.findAllForAddContact(
      deprecatedUserIds,
      keyword
    );
    resolve(users);
  });
};

let addNew = (req_user, contactId) => {
  console.log("add new service");
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(req_user._id, contactId);
    if (contactExists) {
      return resolve(false);
    }

    let newContactItem = {
      userId: req_user._id,
      contactId: contactId,
    };

    let newContact = await ContactModel.createNew(newContactItem);

    let notificationItem = {
      senderId: req_user._id,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT,
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  });
};

let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await ContactModel.removeContact(
      currentUserId,
      contactId
    );
    if (removeContact.deletedCount === 0) {
      reject(false);
    }

    resolve(true);
  });
};

let removeRequestContactSent = (currentUserId, contactId) => {
  //  console.log("remove contact service");
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactSent(
      currentUserId,
      contactId
    );
    if (removeReq.deletedCount === 0) {
      resolve(false);
    }
    //remove notification
    let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
    await NotificationModel.model.removeRequestContactSentNotification(
      currentUserId,
      contactId,
      notifTypeAddContact
    );
    resolve(true);
  });
};

let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(
      currentUserId,
      contactId
    );
    if (removeReq.deletedCount === 0) {
      resolve(false);
    }

    resolve(true);
  });
};

let approveRequestContactReceived = (currentUserId, contactId) => {
  //  console.log("approve contact service");
  return new Promise(async (resolve, reject) => {
    let approveReq = await ContactModel.approveRequestContactReceived(
      currentUserId,
      contactId
    );
    console.log(approveReq);
    if (approveReq.nModified === 0) {
      // nModified  == 0 là lỗi == 1 là thành công
      reject(false);
    }

    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.APPROVE_CONTACT,
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(approveReq);
  });
};

let getContacts = (currentUserId) => {
  //  console.log("remove contact service");
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );

      let users = contacts.map(async (contact) => {
        console.log(contact._doc.contactId);

        if (contact._doc.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else return await UserModel.getNormalUserDataById(contact.contactId);
      });
      console.log("tessttt");
      console.log(users);

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsSent = (currentUserId) => {
  //  console.log("remove contact service");
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSent(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );

      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * read more contact , max 10 one time
 * @param {string} currentUserId
 * @param {number} skipNumberContacts
 * @returns
 */
let readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(
        currentUserId,
        skipNumberContacts,
        LIMIT_NUMBER_TAKEN
      );

      let users = newContacts.map(async (contact) => {
        if (contacts.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * read more contact sent , max 10 one time
 * @param {string} currentUserId
 * @param {number} skipNumberContacts
 * @returns
 */
let readMoreContactsSent = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsSent(
        currentUserId,
        skipNumberContacts,
        LIMIT_NUMBER_TAKEN
      );

      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * read more contact received , max 10 one time
 * @param {string} currentUserId
 * @param {number} skipNumberContacts
 * @returns
 */
let readMoreContactsReceived = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsReceived(
        currentUserId,
        skipNumberContacts,
        LIMIT_NUMBER_TAKEN
      );

      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (err) {
      reject(err);
    }
  });
};

let getListFriends = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContactModel.getFriends(currentUserId);
    friends.forEach((item) => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    friendIds = _.uniqBy(friendIds);

    friendIds = friendIds.filter((userId) => userId != currentUserId);
    let users = await UserModel.getListFriends(friendIds);
    resolve(users);
  });
};

let countFriend = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContactModel.getFriends(currentUserId);
    friends.forEach((item) => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    friendIds = _.uniqBy(friendIds);

    friendIds = friendIds.filter((userId) => userId != currentUserId);
    let users = await UserModel.getListFriends(friendIds);
    resolve(users.length);
  });
};

export default {
  findUserContact: findUserContact,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  getContacts: getContacts,
  getContactsSent: getContactsSent,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactSent: countAllContactSent,
  countAllContactReceived: countAllContactReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  removeContact: removeContact,
  getListFriends: getListFriends,
  countFriend: countFriend,
};
