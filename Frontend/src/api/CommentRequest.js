import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const getCommentsByIdPost = (idPost) => {
  return API.get(`/comment/get-by-idPost/${idPost}`);
};
export const addComment = (newComment) => {
  return API.post(`/comment/add-new`, {
    user_token: newComment.user_token,
    idPost: newComment.postId,
    content: newComment.content,
  });
};

export const removeComment = (user_token, idComment) => {
  return API.delete(`/comment/remove-by-id`, {
    data: { user_token: user_token, idComment: idComment },
  });
};
