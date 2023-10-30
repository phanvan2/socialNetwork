import swal from "sweetalert";

const authReducer = (state = { authData: null, loading: false, error: false }, action) => {
    switch (action.type) {
        case "AUTH_START":
            return { ...state, loading: true, error: false }
        case "AUTH_SUCCESS":
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }))
            return { ...state, authData: action.data, loading: false, error: false }
        case "AUTH_FAIL":
            console.log("falie rùi " );
            swal({
                title: action.data.message,
                icon: "error",
                button: "OK!",
              });
            return { ...state, loading: false, error: true }
        case "LOG_OUT":
            localStorage.clear()
            return { ...state, authData: null , loading: false, error: false }
        default:
            return state;
    }
}

export default authReducer