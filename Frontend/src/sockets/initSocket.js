import { socketStore } from "../store";


export const initSocket = (user) => {
    const socket_ = socketStore((state) => state.socket);

    if(user) {
        try {
            console.log(user.data._id); 
            socket_.auth.token = user.token;
            socket_.connect();
            // setSocket(socket);



        } catch (error) {

        }
      
          
    }else{
        try {
            socket_.disconnect() ;

        } catch (error) {
            
        }
        // setSocket(socket); 
    }
}


 
