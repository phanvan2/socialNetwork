import _ from "lodash";
import jwt from "jsonwebtoken";

import { chat } from "../services/index";

let createNew = async (req, res) => {
  if (!_.isEmpty(req.body)) {
    try {
      let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
      let data = {
        messageType: req.body.messageType,
        text: req.body.text,
      };

      let result = await chat.addNew(req_user._id, req.body.receiverId, data);
      if (result) return res.status(200).send(true);
      else {
        return res.send(false);
      }
    } catch (error) {
      return res.send(false);
    }
  }
  {
    return res.send(false);
  }
};

let getChatByReceiver = async (req, res) => {
  if (req.query) {
    try {
      let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);

      let userId = req_user._id; // id sender
      let receiverId = req.query.receiverId;

      let result = await chat.getChatByReceiver(userId, receiverId);
      if (result) return res.status(200).send(result);
      else {
        return res.send([]);
      }
    } catch (error) {
      return res.send(false);
    }
  }
  {
    return res.send([]);
  }
};

export default {
  createNew: createNew,
  getChatByReceiver: getChatByReceiver,
};
