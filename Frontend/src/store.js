import create from 'zustand';

export const userInfoStore = create((set) => ({
    userInfo: {},// current user
    setUserInfo: (data) => set((state) => ({ userInfo: data })),

    otherUserInfor: {},// thông tin cá nhân của người khác khi vào trang profile của người khác
    setOtherUserInfor: (data) => set((state) => ({ otherUserInfor: data })),

    posts:[],
    setPosts : (data) => set((state) => ({ posts: data })),
    addPosts : (data) => set((state) => ({posts : [data , ...state.posts]})),
  })); 

export const socketStore = create((set) => ({
  socket: null,
  setSocket: (data) => set((state) => ({ socket: data })),

})); 


export const notificationStore = create((set) => ({
  notifications: [],
  setNotification: (data) => set((state) => ({ notifications: data })),
  addNotification: (data) => set((state) => ({ notifications: [data, ...state.notifications] })),

})); 

export const friendsStore = create((set) =>({
  friends: [],
  setFriends: (data) => set((state) => ({friends: data})),
})); 

export const friendsOnlineStore =create((set) =>({
  friendsOnline: [],
  setFriendsOnline: (data) => set((state) => ({friendsOnline: data})),
  addFriendOnline: (data) => set((state)=>  ({friendsOnline : [data , ...state.friendsOnline]})),
  removeFriendOffline: (data) => set((state)=>  ({friendsOnline : state.friendsOnline.filter((value)=> value != data)})),
})); 

