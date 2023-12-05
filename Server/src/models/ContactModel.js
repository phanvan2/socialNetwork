import mongoose from 'mongoose' ; 

let Schema =  mongoose.Schema ;

let ContactShema = new Schema({
    userId: String , 
    contactId: String,
    status: {type: Boolean, default: false},
    createAt: {type: Number, default: Date.now}, 
    updateAt: {type: Number, default: Date.now}, 
    deleteAt: {type: Number, default: null}, 


}); 

ContactShema.statics = {
    createNew(item) {
        return this.create(item) ; 
    },

    /**
     * find all item 
     * @param {string} userId 
     */
    findAllByUser(userId){
        return this.find({
            $or:[
                {"userId": userId},
                {"contactId": userId}
            ]
        }).exec();
    },

    /**
     * check exists of 2 user 
     * @param {string} userId 
     * @param {string} contactId 
     */
    checkExists(userId, contactId){
        return this.findOne({
            $or:[
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId}
                ]},
                {$and: [
                    {"userId": contactId},
                    {"contactId": userId}
                ]}
            ]
        }).exec(); 
    },

    /**
     * 
     * @param {*} userId 
     * @param {*} contactId 
     */
    removeContact(userId, contactId){
        return this.deleteOne({
            $or:[
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId}, 
                    {"status": true}
                ]},
                {$and: [
                    {"userId": contactId},
                    {"contactId": userId},
                    {"status": true}

                ]}
            ]
        });

    },

    /**
     * remove request contact sent
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeRequestContactSent(userId, contactId){
        // console.log("remove contact model");
        // console.log(userId + "vvvv" + contactId) ; 
        return this.deleteOne({
            $and:[
                {"userId": userId},
                {"contactId": contactId},
                {"status": false}
            ]
        }).exec();
    },

    /**
     * remove request contact received
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeRequestContactReceived(userId, contactId){
  
        return this.deleteOne({
            $and:[
            {"contactId": userId},
            {"userId": contactId},
            {"status": false}
            ]
        }).exec();
    },

    /**
     * approve request contact received
     * @param {string of curentUsser} userId 
     * @param {string} contactId 
     */
    approveRequestContactReceived(userId, contactId){
       
        return this.updateOne({
            $and:[
            {"contactId": userId},
            {"userId": contactId}, 
            {"status": false}
            ]
        },{
            "status": true,
            "updateAt": Date.now()
        }).exec();
    },
    

    /**
     * get Contacts by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */
    getContacts(userId, limit){
        return this.find({
            $and:[
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({"updateAt": -1}).limit(limit).exec();
    },

    /**
     * get Contacts sent by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */
    getContactsSent(userId, limit){
        return this.find({
            $and:[
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createAt": -1}).limit(limit).exec();
    },

    /**
     * get Contacts received by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */
    getContactsReceived(userId, limit){
        return this.find({
            $and:[
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({"createAt": -1}).limit(limit).exec();
    },

    /**
     * Count all Contacts by userId and limit
     * @param {string} userId
     * @returns 
     */
    countAllContacts(userId){
        return this.count({
            $and:[
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).exec();
    },

    /**
     * Count all Contacts sent by userId and limit
     * @param {string} userId 
     * @returns 
     */
    countAllContactSent(userId){
        return this.count({
            $and:[
                {"userId": userId},
                {"status": false}
            ]
        }).exec();
    },

    /**
     * Count all Contacts received by userId and limit
     * @param {string} userId 
     * @returns 
     */
    countAllContactReceived(userId){
        return this.count({
            $and:[
                {"contactId": userId},
                {"status": false}
            ]
        }).exec();
    },

    readMoreContacts( userId, skip, limit){
        return this.find({
            $and:[
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({"updateAt": -1}).skip(skip).limit(limit).exec();
    },

    /**
     * read more contacts sent by userId, skip , limit
     * @param {string} userId 
     * @param {number} skip 
     * @param {number} limit 
     * @returns 
     */
    readMoreContactsSent( userId, skip, limit){
        return this.find({
            $and:[
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createAt": -1}).skip(skip).limit(limit).exec();
    },

    /**
     * read more contacts received by userId, skip , limit
     * @param {string} userId 
     * @param {number} skip 
     * @param {number} limit 
     * @returns 
     */
    readMoreContactsReceived( userId, skip, limit){
        return this.find({
            $and:[
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({"createAt": -1}).skip(skip).limit(limit).exec();
    },  

    /**
     * update contact when has new message      
     * @param {String} userId current usser id
     * @param {String} contactId contact id
     */
    updateWhenHasNewMessage(userId, contactId){

        return this.updateOne({
            $or:[
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId}
                ]},
                {$and: [
                    {"userId": contactId},
                    {"contactId": userId}
                ]}
            ]
        }, {
            "updateAt": Date.now() 
        }).exec();
    },

    /**
     * get Contact friends by userId
     * @param {string} userId 
     * @returns 
     */
    getFriends(userId){
        return this.find({
            $and:[
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({"updateAt": -1}).exec();
    },


}
export default mongoose.model("contact", ContactShema); 
