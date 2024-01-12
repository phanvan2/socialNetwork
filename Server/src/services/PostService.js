import bcrypt from "bcrypt";
import fs from "fs-extra";
import TfIdf from "node-tfidf";
import tf, { train } from "@tensorflow/tfjs-node";
import "@tensorflow/tfjs-node";
// import fs from 'fs';

import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import ResearchModel from "../models/ResearchModel";
import ViewedModel from "../models/ViewedModel";

import ResearchService from "./ResearchService";
import ContactService from "./ContactService";
import train_model from "./train_model";
import { app } from "../config/app";

let addNewPost = (item) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {
                userId: item.userId,
                desc: item.desc,
                title: item.title,
                image: item.image,
            };
            let result = await PostModel.createNew(data);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
};

let getPostbyIdPost = (idPost) => {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await PostModel.getPostbyIdPost(idPost);
            if (post) {
                let user = await UserModel.findUserById(post.userId);
                let result = {
                    _id: post._id,
                    userId: user[0]._id,
                    lastName: user[0].lastName,
                    firstName: user[0].firstName,
                    avatar: user[0].avatar,
                    email: user[0].email,
                    desc: post.desc,
                    title: post.title,
                    image: post.image,
                    likes: post.like,
                    creatAt: post.creatAt,
                    updateAt: post.updateAt,
                    deleteAt: post.deleteAt,
                };
                resolve(result);
            } else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
};

let getPostbyIdUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await PostModel.getPostbyIdUser(idUser);

            if (result) {
                let result1 = result.map(async (post) => {
                    let user = await UserModel.findUserById(post.userId);
                    console.log(user);
                    return {
                        _id: post._id,
                        userId: user[0]._id,
                        lastName: user[0].lastName,
                        firstName: user[0].firstName,
                        avatar: user[0].avatar,
                        email: user[0].email,
                        desc: post.desc,
                        title: post.title,
                        image: post.image,
                        likes: post.like,
                        creatAt: post.creatAt,
                        updateAt: post.updateAt,
                        deleteAt: post.deleteAt,
                    };
                });
                resolve(await Promise.all(result1));
            } else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
};

let getPostsByFriend = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactService.getListFriends(idUser);
            let idFriends = contacts.map((value) => {
                return value._id;
            });

            let posts = await PostModel.getPostsByFriend(idFriends);
            let result = posts.map(async (post) => {
                let user = await UserModel.findUserById(post.userId);

                return {
                    _id: post._id,
                    userId: user[0]._id,
                    lastName: user[0].lastName,
                    firstName: user[0].firstName,
                    avatar: user[0].avatar,
                    email: user[0].email,
                    desc: post.desc,
                    title: post.title,
                    image: post.image,
                    likes: post.like,
                    creatAt: post.creatAt,
                    updateAt: post.updateAt,
                    deleteAt: post.deleteAt,
                };
            });

            resolve(await Promise.all(result));
        } catch (err) {
            reject(err);
        }
    });
};

let getPostsByListfriend = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactService.getListFriends(idUser);
            console.log("dddd");
            console.log(contacts);
            let idFriends = contacts.map((value) => {
                return value._id;
            });

            let posts = await PostModel.getPostsByFriend(idFriends);

            resolve(posts);
        } catch (err) {
            reject(err);
        }
    });
};

let searchPost = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {
                idUser: currentUserId,
                keyword: keyword,
            };
            await ResearchService.addNewResearch(currentUserId, keyword);
            let result = await PostModel.searchPost(data);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
};

let removeById = (idUser, idPost) => {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await PostModel.getPostbyIdPost(idPost);
            await fs.remove(`${app.post_directory}/${post.image}`);

            let result = await PostModel.removePost(idUser, idPost);
            console.log(result);
            if (result.deletedCount === 0) {
                return resolve(false);
            }

            return resolve(true);
        } catch (err) {
            return reject(err);
        }
    });
};

let updatePost = (idPost, item) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (item.image) {
                let post = await PostModel.getPostbyIdPost(idPost);
                await fs.remove(`${app.post_directory}/${post.image}`);
            }

            let resultUpdate = await PostModel.updatePost(idPost, item);
            if (resultUpdate) return resolve(resultUpdate.image);
            else return resolve(false);
        } catch (error) {
            console.log(error);
            return resolve(false);
        }
    });
};

let getRealTime = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let research = await ResearchModel.getLimitByIdUser(idUser);
            let currentUser = await UserModel.findUserById(idUser);
            let postFriend = await getPostsByListfriend(idUser);
            let dataset1 = await PostModel.getPostAll();
            let dataset = [];
            research.map((value) => {
                dataset.push(value.contentSearch.toLowerCase());
            });

            const aaa = fs.readFileSync("model.json", "utf-8");
            var tfidf = new TfIdf(JSON.parse(aaa));

            let trainData1 = [];
            let data_ = [];
            let data_idPost = [];
            dataset.map((value) => {
                tfidf.tfidfs(value.split(" "), function (i, measure) {
                    // console.log("document #" + dataset[i] + " is " + measure);
                    if (measure > 0) {
                        if (data_.indexOf(i) < 0) {
                            let dataa = {
                                ...dataset1[i]._doc,
                                similarities: measure,
                            };
                            data_.push(i);
                            // trainData1.push(dataa);
                        }
                    }
                });
            });

            const data1 = JSON.parse(fs.readFileSync("data1.json", "utf-8"));

            // Tải mô hình từ thư mục đã lưu
            let loadModel = await tf.loadLayersModel(
                "file:///D/socialNetwork/Server/src/my_model/model.json"
            );

            const newData = tf.tensor2d([
                [
                    data1.citydata.indexOf(currentUser[0].citydata),
                    data1.workAt.indexOf(currentUser[0].workAt),
                    data1.gender.indexOf(currentUser[0].gender),
                    data1.relationship.indexOf(currentUser[0].relationship),
                ],
            ]);
            const predictions1 = loadModel.predict(newData);

            predictions1.dataSync().map(async (i) => {
                if (
                    data_.indexOf(Math.round(i)) < 0 &&
                    dataset1[Math.round(i)] &&
                    Math.round(i) > 0
                ) {
                    data_.push(Math.round(i));
                    trainData1.push(dataset1[Math.round(i)]);
                    data_idPost.push(dataset1[Math.round(i)]._id);
                }
            });

            postFriend.map((value) => {
                if (data_idPost.indexOf(value._id) < 0) {
                    trainData1.push(value);
                    data_idPost.push(value._id);
                }
            });
            let result1 = trainData1.map(async (post) => {
                let user = await UserModel.findUserById(post.userId);
                let viewObject = await ViewedModel.getViewedPost({
                    postId: post._id,
                    userId: currentUser[0]._id,
                });
                return {
                    _id: post._id,
                    userId: user[0]._id,
                    lastName: user[0].lastName,
                    firstName: user[0].firstName,
                    avatar: user[0].avatar,
                    email: user[0].email,
                    desc: post.desc,
                    title: post.title,
                    image: post.image,
                    likes: post.like,
                    creatAt: post.creatAt,
                    updateAt: post.updateAt,
                    deleteAt: post.deleteAt,
                    viewed: viewObject ? viewObject.view : 0,
                };
            });
            let final_result = await Promise.all(result1);
            final_result = final_result.filter((value) => {
                console.log("000000000000");
                console.log(`${value.userId}`);
                console.log(idUser);
                if (`${value.userId}` === idUser) return false;
                return true;
            });
            final_result.sort((a, b) => {
                if (a.viewed > b.viewed) return 1;
                else if (a.viewed < b.viewed) return -1;
                else return 0;
            });
            return resolve(final_result);
        } catch (error) {
            console.log(error);
            return resolve(false);
        }
    });
};
export default {
    addNewPost,
    getPostbyIdUser,
    getPostsByFriend,
    getPostsByListfriend,
    searchPost,
    getPostbyIdPost,
    removeById,
    updatePost,
    getRealTime,
};
