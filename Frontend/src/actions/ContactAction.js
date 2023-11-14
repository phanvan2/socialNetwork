import * as ContactApi from "../api/contactRequest.js"
import {socketStore} from "../store.js"; 

export const findContact = (keyword, user_token)=> async (dispatch) =>{
    dispatch({
        type : "FIND_CONTACT"
    })
    try {
        const data = await ContactApi.findContact(keyword, user_token);
        if(data.data.data == false){
            dispatch({
                type : "CONTACT_FIND_FAIL", 
                data : data.data
            })
        }else{
            dispatch({
                type : "CONTACT_FIND_SUCCESS",
                data : data.data
            })
        }
 
    } catch (error) {
        console.log(error);
        dispatch({
            type : "CONTACT_FIND_FAIL",
            data: { data: false}
        })
    }
} 

export const addContact = (user_token, contactId) => async(dispatch) => {
    try {
        const data = await ContactApi.addContact(user_token, contactId);
        if(data.data.data == false){
            dispatch({
                type : "CONTACT_FIND_FAIL", 
                data : data.data
            })
        }else{
            const socket_ = socketStore((state) => state.socket);
            socket_.emit("add-new-contact", {contactId: contactId}) 
            dispatch({
                type : "CONTACT_FIND_SUCCESS",
                data : data.data
            })
        }
 
    } catch (error) {
        console.log(error);
        dispatch({
            type : "CONTACT_FIND_FAIL",
            data: { data: false}
        })
    }
}