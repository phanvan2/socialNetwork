import bcrypt from "bcrypt";
import fs from "fs-extra";
import TfIdf from "node-tfidf";
import tf from "@tensorflow/tfjs-node";
import "@tensorflow/tfjs-node";
// import fs from 'fs';

import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import ResearchModel from "../models/ResearchModel";

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
          firstName: user[0].fistName,
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
            firstName: user[0].fistName,
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
      console.log("dddd");
      console.log(contacts);
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
          firstName: user[0].fistName,
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

      let dataset1 = await PostModel.getPostAll();

      let dataset = [];
      research.map((value) => {
        dataset.push(value.contentSearch.toLowerCase());
      });

      const aaa = fs.readFileSync("model.json", "utf-8");
      var tfidf = new TfIdf(JSON.parse(aaa));

      let trainData1 = [];
      let data_ = [];
      dataset.map((value) => {
        tfidf.tfidfs(value.split(" "), function (i, measure) {
          // console.log("document #" + dataset[i] + " is " + measure);
          if (measure > 0) {
            // console.log(dataset[i].title);
            if (data_.indexOf(i) < 0) {
              let dataa = {
                ...dataset1[i]._doc,
                similarities: measure,
              };
              data_.push(i);
              trainData1.push(dataa);
            }
          }
        });
      });
      // console.log(trainData1);

      // let result = await Promise.all(train_model.prediction(dataset));

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
      predictions1.dataSync().map((i) => {
        if (data_.indexOf(Math.round(i)) < 0) {
          let dataa = {
            ...dataset1[Math.round(i)]._doc,
          };
          console.log(dataa);
          data_.push(Math.round(i));
          trainData1.push(dataa);
        }
      });
      console.log("0000000000000000000");
      let result1 = trainData1.map(async (post) => {
        let user = await UserModel.findUserById(post.userId);
        return {
          _id: post._id,
          userId: user[0]._id,
          lastName: user[0].lastName,
          firstName: user[0].fistName,
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
      return resolve(await Promise.all(result1));
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
  searchPost,
  getPostbyIdPost,
  removeById,
  updatePost,
  getRealTime,
};
