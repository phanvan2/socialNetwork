import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})


export const addNewPost =(data) => {
    const config = {
        headers: {
            "Content-Type":"application/json"
        }
      }
    return API.post('/post/add-new', data, config) ; 
}

export const getTimelinePosts = (id) =>{
    return API.get(`/post/get-by-idUser/${id}`)
}

export const getPostsByFriend = (token) => {
    return API.get(`post/get-by-friend?user_token=${token}`) ;
}

export const likePost = (id , userId) =>{
    API.put(`/post/${id}/like`, {userId})
}

export const searchPost =  (user_token , keyword) =>{
    return API.get(`/post/search-post?user_token=${user_token}&keyword=${keyword}`)
}

export const getPostsByIdPost = (idPost) => {
    return API.get(`/post/get-by-idPost/${idPost}`);
}