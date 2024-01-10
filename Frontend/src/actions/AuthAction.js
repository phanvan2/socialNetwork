import * as AuthApi from "../api/AuthRequest.js";

export const logIn = (formData) => async (dispatch) => {
    dispatch({
        type: "AUTH_START",
    });
    try {
        const data = await AuthApi.logIn(formData);

        if (data.data.data == false) {
            dispatch({
                type: "AUTH_FAIL",
                data: data.data,
            });
        } else {
            dispatch({
                type: "AUTH_SUCCESS",
                data: data.data,
            });
        }
    } catch (error) {
        console.log(error);
        dispatch({
            type: "AUTH_FAIL",
        });
    }
};

export const logOut = () => async (dispatch) => {
    dispatch({
        type: "LOG_OUT",
    });
};

export const signUp = (formData) => async (dispatch) => {
    dispatch({
        type: "AUTH_START",
    });
    try {
        let data = await AuthApi.signUp(formData);
        if (data.data.data === false) {
            dispatch({
                type: "AUTH_FAIL",
                data: { data: { message: "Error" } },
            });
        } else {
            dispatch({
                type: "AUTH_SUCCESS",
                data: data.data,
            });
        }
    } catch (error) {
        dispatch({
            type: "AUTH_FAIL",
            data: { data: { message: "Error" } },
        });
    }
};
