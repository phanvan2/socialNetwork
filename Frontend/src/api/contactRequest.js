import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})

export const findContact = (keyword, token_user) =>{
    return API.get(`/contact/find-users/${keyword}?user_token=${token_user}`);
}
export const addContact = (token_user,contactId ) =>{
    return API.post(`/contact/add-new`, {user_token: token_user, contactId: contactId });
}

export const approveRequestContact = (token_user,contactId ) =>{
    console.log("request ") ; 
    return API.put(`/contact/approve-request-contact-received`,  {user_token: token_user, contactId: contactId });
}

export const getListFriend = (token_user) => {
    return API.get(`/contact/get-list-friends?user_token=${token_user}`) ; 
    
}





