import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})

export const logIn = (formData) =>{
    return API.post('/auth/login' , formData)
}

export const signUp = (formData) =>{
    return API.post('/auth/register' , formData)
}

export const checkExpiredToken = (token) => {
    return API.get(`/check/token/${token}`)
}