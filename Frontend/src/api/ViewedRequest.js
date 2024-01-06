import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const addViewed = (user_token, postId) => {
  return API.post(`/viewed/add-new`, {
    user_token: user_token,
    idPost: postId,
  });
};
