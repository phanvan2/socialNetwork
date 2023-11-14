
const contactFind = (state = { contactfind: null, loading: false, error: false }, action) => {
    switch (action.type) {
        case "FIND_CONTACT":
            return { ...state, loading: true, error: false }
        case "CONTACT_FIND_SUCCESS":
            return { ...state, contactfind: action.data, loading: false, error: false }
        case "CONTACT_FIND_FAIL":
            return { ...state, contactfind: action.data, loading: false, error: true }
        default:
            return state;
    }
}



export default contactFind;