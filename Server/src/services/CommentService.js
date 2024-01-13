import CommentModel from "../models/CommentModel";
import UserModel from "../models/UserModel";

let addNew = (req_user, data) => {
    return new Promise(async (resolve, reject) => {
        let item = {
            userId: req_user._id,
            postId: data.postId,
            content: data.content,
        };
        let result = await CommentModel.createNew(item);
        if (result) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

let getCommentByPost = (idPost, skipNumberComment = 0) => {
    return new Promise(async (resolve, reject) => {
        let comments = await CommentModel.getCommentByPost(
            idPost,
            skipNumberComment
        );
        let results = comments.map(async (comment) => {
            let user = await UserModel.findUserById(comment.userId);
            return {
                _id: comment._id,
                userId: comment.userId,
                lastName: user[0].lastName,
                firstName: user[0].firstName,
                avatar: user[0].avatar,
                email: user[0].email,
                postId: comment.postId,
                content: comment.content,
                creatAt: comment.creatAt,
                updateAt: comment.updateAt,
            };
        });
        if (results) {
            return resolve(await Promise.all(results));
        } else {
            return resolve(false);
        }
    });
};

let removeCommentById = (req_user, idComment) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await CommentModel.removeCommentById(
                req_user._id,
                idComment
            );

            console.log(result);
            if (result.deletedCount === 0) {
                return resolve(false);
            }

            return resolve(true);
        } catch (error) {
            return resolve(false);
        }
    });
};

export default {
    addNew: addNew,
    getCommentByPost: getCommentByPost,
    removeCommentById: removeCommentById,
};
