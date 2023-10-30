import create from 'zustand';

const userInfoStore = create((set) => ({
    userInfo: {},
    setUserInfo: (data) => set((state) => ({ userInfo: data })),

    otherUserInfor: {},
    setOtherUserInfo: (data) => set((state) => ({ otherUserInfor: data })),

    posts:[],
    setPosts : (data) => set((state) => ({ posts: data })),
    addPosts : (data) => set((state) => ({posts : [data , ...state.posts]})),
  }))

export default userInfoStore