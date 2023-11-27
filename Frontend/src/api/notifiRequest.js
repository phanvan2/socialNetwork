import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})

export const getNotification = (skipNumber, token_user) =>{
    return API.get(`/notification/read-more?skipNumber=${skipNumber}&user_token=${token_user}`);
}
