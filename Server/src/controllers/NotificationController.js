import { Notification } from "./../services/index";
import jwt from "jsonwebtoken";

let readMore = async (req, res) => {
    try {
        // get skip number from query paramm
        let skipNumberNotification = +req.query.skipNumber;

        // get more items
        let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
        let newNotifications = await Notification.readMore(
            req_user._id,
            skipNumberNotification
        );
        return res.status(200).send({ data: newNotifications });
    } catch (error) {
        return res.send({ data: false });
    }
};

let markAllAsRead = async (req, res) => {
    try {
        let mark = await Notification.markAllAsRead(
            req.user._id,
            req.body.targetUsers
        );
        return res.status(200).send(mark);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

let countNotification = async (req, res) => {
    try {
        let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
        let numberNotification = await Notification.countNotification(
            req_user._id
        );
        return res.status(200).send({ numberNotification: numberNotification });
    } catch (error) {
        return res.send({ numberNotification: false });
    }
};

export default {
    readMore: readMore,
    markAllAsRead: markAllAsRead,
    countNotification: countNotification,
};
