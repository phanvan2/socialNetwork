const backDropReducer = (state = {  open: false, }, action) => { 
    switch (action.type) {
        case "BACKDROP_ON":
            return { ...state, open: true, }
        case "BACKDROP_OFF":
            return { ...state, open: false  }
        default:
            return state;
    }
}

export default backDropReducer;