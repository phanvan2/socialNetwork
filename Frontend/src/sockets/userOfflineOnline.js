export const userOfflineOnline = (socket,setFriendsOnline, addFriendOnline, removeFriendOffline ) => {

    socket.on("server-send-list-users-online", function(listUserIds){
        setFriendsOnline(listUserIds)
    }); 
    
    socket.on("server-send-when-new-user-online", function(userId){
        addFriendOnline(userId)
    });
    
    
    socket.on("server-send-when-new-user-offline", function(userId){
        removeFriendOffline(userId)

    })
    
}

