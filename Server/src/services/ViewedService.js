import ViewedModel from "../models/ViewedModel";
import UserModel from "../models/UserModel";

let addNew = (idUser, idPost) => {
  return new Promise(async (resolve, reject) => {
    let item = {
      userId: idUser,
      postId: idPost,
    };
    let result = await ViewedModel.getViewedPost(item);
    if (!result) {
      await ViewedModel.createNew(item);
    } else {
      item.view = result.view + 1;
      await ViewedModel.updateViewed(item);
    }
    resolve(true);
  });
};

export default {
  addNew: addNew,
};
