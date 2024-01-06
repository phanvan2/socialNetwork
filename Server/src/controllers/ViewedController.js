import _ from "lodash";
import jwt from "jsonwebtoken";

import { viewed } from "../services/index";

let createNew = async (req, res) => {
  if (!_.isEmpty(req.body)) {
    try {
      let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);

      let result = await viewed.addNew(req_user._id, req.body.idPost);
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

let checkViewed = async (req, res) => {};

export default {
  createNew: createNew,
};
