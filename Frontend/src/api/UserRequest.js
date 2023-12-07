import axios from "axios"

const API = axios.create({baseURL : process.env.REACT_APP_API_URL})

export const getUser = (id) =>{
    return API.get(`/user/${id}`)
}

export const updateUser = (formData) => {
    return API.put(`/user/update-profile` , formData)
    
}

