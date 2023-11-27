import { alertt_success } from "../actions/AlertAction";


export const getRequestFriend = (socket,  addNotification, dispatch)=> {

   
    socket.on("response-add-new-contact", (newNotification)=> {
        console.log(newNotification) ; 
        if(newNotification){
            addNotification(newNotification);
            dispatch(alertt_success("You have a new notification"));
        }
       
       
    });

   
    
      
}

 
