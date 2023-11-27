import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})

export const getTimelinePosts = (id) =>{
    return API.get(`/post/get-by-idUser/${id}`)
}

export const likePost = (id , userId) =>{
    API.put(`/post/${id}/like`, {userId})
}
