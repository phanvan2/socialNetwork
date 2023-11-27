import { alertt_success } from "../actions/AlertAction";



export const approveRequestContactReceived = (socket,  addNotification, dispatch)=> {

    socket.on("response-approve-request-contact-received", (newNotification) =>{
        console.log("tôi nhận đc approve request"); 
        console.log(newNotification);
        if(newNotification){
            addNotification(newNotification) ; 
            dispatch(alertt_success("You have a new notification"));
        }

    });

   
    
      
}
