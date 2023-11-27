const alertReducer = (state = { status: "success", open: false, message: "oke bro" }, action) => { 
    switch (action.type) {
        case "ALERT_ON":
            return { ...state, status: "success", open: true, message: action.data }
        case "ALERT_OFF":
            return { ...state, open: false  }
        default:
            return state;
    }
}

export default alertReducer;