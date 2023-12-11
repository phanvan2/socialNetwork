import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})


export const addLike = (user_token, postId ) =>{
    return API.post(`/like/add-new`, {user_token:user_token, idPost: postId });
};
export const removeLike = (user_token, postId ) =>{
    return API.delete(`/like/remove-one`, {data:{user_token:user_token, idPost: postId }});
};
export const getLikesbyPost = (postId) => {
    return API.get(`/like/get-by-idPost/${postId}`);
}

export const getInforLike = (postId,user_token = null  ) => {
    return API.get(`/like/get-intereaction?idPost=${postId}&user_token=${user_token}`);

}




