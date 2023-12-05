import moment from "moment"


export const convertTimestampToHumanTime = (timestamp) => {
    if(!timestamp){
        return "" ; 
    }
    return moment(Number(timestamp)).locale("en").startOf("second").fromNow() ; 
}


export const NOTIFICATIONTYPES =  {
    ADD_CONTACT: "add_contact",
    APPROVE_CONTACT: "approve_contact",
    MENTION_YOU: "mention_you_comment",
    REGISTER_SUCCESS: "register_success",
}

export const STATUS_HANDLE_FRIEND =  {
    ADD_FRIEND: "Add Friend", // chưa kết bạn
    FRIEND: "Friend",   // kết bạn rùi 
    REQUEST_FRIEND: "Cancel request Friend", // người gửi hủy yêu cầu kết bạn
    CONFIRM_FRIEND: "Confirm friend",// người nhận lời mời xác nhận kết bạn
}