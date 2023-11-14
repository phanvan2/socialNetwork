import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})

export const findContact = (keyword, token_user) =>{
    return API.get(`/contact/find-users/${keyword}?user_token=${token_user}`);
}
export const addContact = (token_user,contactId ) =>{
    return API.post(`/contact/add-new`, {user_token: token_user, contactId: contactId });
}


