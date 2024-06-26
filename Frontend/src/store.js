import create from "zustand";

export const userInfoStore = create((set) => ({
  userInfo: {}, // current user
  setUserInfo: (data) => set((state) => ({ userInfo: data })),

  otherUserInfor: {}, // thông tin cá nhân của người khác khi vào trang profile của người khác
  setOtherUserInfor: (data) => set((state) => ({ otherUserInfor: data })),

  posts: [],
  setPosts: (data) => set((state) => ({ posts: data })),
  addPosts: (data) => set((state) => ({ posts: [data, ...state.posts] })),
}));

export const socketStore = create((set) => ({
  socket: null,
  setSocket: (data) => set((state) => ({ socket: data })),
}));

export const notificationStore = create((set) => ({
  numberNotification: 0,
  setNumberNotification: (data) =>
    set((state) => ({ numberNotification: data })),
  increaseNumberNotification: () =>
    set((state) => ({ numberNotification: state.numberNotification + 1 })),

  notifications: [],
  setNotification: (data) => set((state) => ({ notifications: data })),
  addNotification: (data) =>
    set((state) => ({ notifications: [data, ...state.notifications] })),
  addNotificationlast: (data) =>
    set((state) => ({ notifications: [...state.notifications, ...data] })),
}));

export const friendsStore = create((set) => ({
  friends: [],
  setFriends: (data) => set((state) => ({ friends: data })),
}));

export const postsProfile = create((set) => ({
  postsProfile: [],
  setPostsProfile: (data) => set((state) => ({ postsProfile: data })),
  addPostsProfile: (data) =>
    set((state) => ({ postsProfile: [data, ...state.posts] })),
}));

export const friendsOnlineStore = create((set) => ({
  friendsOnline: [],
  setFriendsOnline: (data) => set((state) => ({ friendsOnline: data })),
  addFriendOnline: (data) =>
    set((state) => ({ friendsOnline: [data, ...state.friendsOnline] })),
  removeFriendOffline: (data) =>
    set((state) => ({
      friendsOnline: state.friendsOnline.filter((value) => value != data),
    })),
}));

export const listChatStore = create((set) => ({
  listChat: [],
  setListChat: (data) => set((state) => ({ listChat: data })),
  addListChat: (data) =>
    set((state) => ({ listChat: [...state.listChat, data] })),
}));
