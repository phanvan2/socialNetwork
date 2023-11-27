export const userOfflineOnline = (socket,setFriendsOnline, addFriendOnline, removeFriendOffline ) => {

    socket.on("server-send-list-users-online", function(listUserIds){
        console.log("List userr") ; 
        setFriendsOnline(listUserIds)
    }); 
    
    socket.on("server-send-when-new-user-online", function(userId){
        console.log("có đứa vào logout") ; 
        addFriendOnline(userId)
    });
    
    
    socket.on("server-send-when-new-user-offline", function(userId){
        console.log("logout qq")
        removeFriendOffline(userId)

    })
    
}

