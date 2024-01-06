import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const sendChat = (user_token, receiverId, data) => {
  return API.post(`/chat/create-new`, {
    user_token: user_token,
    text: data.text,
    messageType: data.messageType,
    receiverId: receiverId,
  });
};
export const getListChatbyIdUser = (user_token, receiverId) => {
  return API.get(
    `/chat/get-chat-by-iduser?user_token=${user_token}&receiverId=${receiverId}`
  );
};
