import _ from "lodash";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import {
    transValidation,
    transSuccess,
    transError,
    transMail,
} from "../../lang/en";
import { User } from "../services";
import sendMail from "../config/mailer";
import { app } from "./../config/app";

let storagePost = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback) => {
        let math = app.post_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transError.image_type, null);
        }
        let nameAvatar = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, nameAvatar);
    },
});

let avatarUploadFile = multer({
    storage: storagePost,
}).single("user_avatar");

let registerUser = async (req, res) => {
    if (_.isEmpty(req.body)) {
        res.send({ data: false, message: transValidation.data_empty });
    } else {
        try {
            let result = await User.registerUser(req.body);
            if (result) {
                console.log("-----------------------");
                console.log(result);
                let token = jwt.sign(result, process.env.JWT_KEY, {
                    expiresIn: "5h",
                });
                console.log(token);
                res.status(200).send({
                    data: result,
                    token: token,
                    message: transSuccess.register_user,
                });
            } else {
                res.send({ data: false, message: transError.register_user });
            }
        } catch (error) {
            console.log(error);

            res.send({ data: false, message: transError.register_user });
        }
    }
};

let login = async (req, res) => {
    if (!_.isEmpty(req.body.token)) {
        try {
            let result = jwt.verify(req.body.token, process.env.JWT_KEY);
            res.status(200).send({
                data: result,
                message: transSuccess.login_user,
            });
        } catch (err) {
            res.send({ data: false, message: transError.login_user });
        }
    } else if (_.isEmpty(req.body)) {
        res.send({ data: false, message: transValidation.data_empty });
    } else {
        try {
            let result = await User.loginUser(req.body);

            if (result) {
                console.log("------------dddddđ-----------");
                console.log(result);
                let token = jwt.sign(result, process.env.JWT_KEY, {
                    expiresIn: "5h",
                });
                res.status(200).send({
                    data: result,
                    token: token,
                    message: transSuccess.login_user,
                });
            } else {
                res.send({ data: false, message: transError.login_user });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

let sendAcitveEmail = async (req, res) => {
    if (_.isEmpty(req.body)) {
        res.send({ data: false, message: transValidation.data_empty });
    } else {
        try {
            let result = jwt.verify(req.body.token, process.env.JWT_KEY);
            // kiểm tra email đã đc đk chưa hoặc tài khoản đã active chưa
            let result_update = await User.updateTokenVerify(result.email);
            console.log("xác minh");
            if (result_update.data && result_update.token) {
                sendMail(
                    result.email,
                    transMail.subject,
                    transMail.template(
                        `localhost:5000/auth/verifyEmail/${result_update.token}`
                    )
                )
                    .then((success) => {
                        console.log("gửi mail thành công");
                        res.send(true);
                    })
                    .catch((error) => {
                        console.log(error);
                        console.log("gửi mail thất bại");
                        res.send(false);
                    });
            } else {
                res.send(false);
            }
        } catch (error) {
            console.log(error);
            res.send(false);
        }
    }
};

let verifyEmail = async (req, res) => {
    if (req.params.token_verify) {
        let result = await User.verifyEmail(req.params.token_verify);
        if (result)
            res.send("<a href='http://localhost:3000/home'>go to home</a>");
        else {
            res.send({ data: false, message: transError.aciveEmail });
        }
    }
};

let getUserById = async (req, res) => {
    if (req.params.id) {
        let currentUserId = false;
        if (req.query.user_token) {
            try {
                let currentUser = jwt.verify(
                    req.query.user_token,
                    process.env.JWT_KEY
                );
                currentUserId = currentUser._id;
            } catch (error) {}
        }
        let result = await User.getUserById(req.params.id, currentUserId);

        if (result) res.send({ data: result, message: "" });
        else {
            res.send({ data: false, message: transError.account_notFound });
        }
    }
};

let checkExpiredToken = async (req, res) => {
    if (!_.isEmpty(req.params.token)) {
        try {
            let result = jwt.verify(req.params.token, process.env.JWT_KEY);
            res.status(200).send({ data: result });
        } catch (err) {
            res.send({ data: false });
        }
    } else {
        res.send({ data: false });
    }
};

let updateProfile = async (req, res) => {
    console.log("update profile");

    avatarUploadFile(req, res, async (error) => {
        if (error) {
            return res.send(error);
        } else {
            if (_.isEmpty(req)) {
                return res.send(false);
            } else {
                try {
                    let req_user = jwt.verify(
                        req.body.user_token,
                        process.env.JWT_KEY
                    );
                    let data = {
                        lastName: req.body.lastName,
                        firstName: req.body.firstName,
                        livesin: req.body.livesin,
                        country: req.body.country,
                        workAt: req.body.workAt,
                        relationship: req.body.relationship,
                        gender: req.body.gender,
                        email: req.body.email,
                        updateAt: Date.now(),
                    };
                    if (req.file) {
                        data.avatar = req.file.filename;
                    }

                    let result = await User.updateUser(req_user._id, data);
                    if (result) {
                        return res.status(200).send(data.avatar || result);
                    } else {
                        return res.send(false);
                    }
                } catch (error) {
                    console.log(error);
                    return res.send(false);
                }
            }
        }
    });
};

export default {
    registerUser,
    login,
    sendAcitveEmail,
    verifyEmail,
    getUserById,
    checkExpiredToken,
    updateProfile,
};
