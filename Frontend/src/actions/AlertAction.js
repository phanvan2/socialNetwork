export const alertt_success = (message)=> async (dispatch) =>{
    dispatch({
        type : "ALERT_ON",
        data : message

    })
    
} 

export const alertt_off = ()=> async (dispatch) =>{
    dispatch({
        type : "ALERT_OFF",

    })
    
} 

