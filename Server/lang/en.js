export const transValidation = {
    data_empty: "Please enter complete information!",
};

export const transSuccess = {
    register_user: "The Account has been successfully created.",
    login_user: "Login success",
    sendVerifyEmail: "Email sent, Please check your email",
    aciveEmail:
        "You have successfully verified your account, please return to the home page to continue using the application",
    addNewPost: "post successfully",

    findContact: "",
    sendReqContact: "Sent friend request successfully",
    removeFriend: "You have successfully deleted this friend",
};

export const transError = {
    register_user: "Registration failed. Please try again later!",
    login_user: "Login fail",
    sendVerifyEmail:
        "Error sending email or account does not exist! Please try again later",
    aciveEmail: "Verification failed! Please try again later",
    addNewPost: "Posting failed",

    findContact: "No result is found",
    sendReqContact:
        "Error, unable to send friend request, please try again later!",

    account_notFound: "Account not found",
    image_type: "Image format error",
    image_size: "Image size is larger than allowed",
    error_: "Unknown error! please try again later,",
    removeFriend: "You have failed to delete this friend",
};

export const transMail = {
    subject: "SocialNetwork :Verify email ",
    template: (linkVerify) => {
        return `<tbody><tr><td height="20"></td></tr>
        <tr><td height="10"></td></tr>
        <tr>
            <td>
                <table class="m_-3116258301937000145table1" width="800" align="center" border="0" cellspacing="0" cellpadding="0">
                    <tbody><tr>
                        <td bgcolor="#F7F7F7" style="padding:20px 0;border:1px solid #f2f2f2;border-radius:5px">
                            <table class="m_-3116258301937000145table1" width="750" align="center" border="0" cellspacing="0" cellpadding="0">
                                <tbody><tr>
                                    <td align="left" style="line-height:1.6;color:#282828;font-size:14px;font-weight:600;font-family:'Open Sans',Helvetica,sans-serif">
                                        <div><span><strong>Hello,</strong></span></div>
                                    </td>
                                </tr>
                                <tr><td height="8"></td></tr>
                                <tr>
                                    <td align="left" style="line-height:1.8;color:#282828;font-size:14px;font-weight:400;font-family:'Open Sans',Helvetica,sans-serif">
                                        <div><span>Welcome to our social networking website!<br>
                                            Please click the button below within 1 hour to verify your email.</span></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" class="m_-3116258301937000145center_content" style="padding-top:10px;padding-bottom:0px;line-height:1;font-size:14px;font-weight:400;font-family:'Open Sans',Helvetica,sans-serif">
                                        <div><span><a href="${linkVerify}" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/XKjtUPKTk2XF5CEExdJpneD8_KEYUu8r2nqWES_5LbjO0Ogcn5Y_BYJbXhUShHxIF-w=s0-d-e1-ft#https://i.imgur.com/VBBPAhW.png" alt="" title="Click here to activate account" class="CToWUd" data-bit="iit"></a></span></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="line-height:1.8;color:#282828;font-size:14px;font-weight:400;font-family:'Open Sans',Helvetica,sans-serif">
                                        <div>
                                            <p>In case you cannot click the button, click on the following link to activate your account:<a href='${linkVerify}' target="_blank">${linkVerify}  </a> </p>
                                            <p>If you encounter any difficulties, please contact us immediately. We are always ready to assist.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr><td height="20"></td></tr>
                                <tr>
                                    <td align="left" style="line-height:1.6;color:#282828;font-size:14px;font-weight:400;font-family:'Open Sans',Helvetica,sans-serif">
                                        <div><span><strong>Best regards,<br>
                                            Social network website team.</strong></span></div>
                                    </td>
                                </tr>
                                <tr><td height="5"></td></tr>
                            </tbody></table>
                        </td>
                    </tr>
                </tbody></table>
            </td>
        </tr>

        <tr><td height="10"></td></tr>



        <tr><td height="20"></td></tr>


        <tr><td height="100"></td></tr>
        </tbody>`;
    },
};
