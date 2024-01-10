import React from "react";
import { useDispatch } from "react-redux";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import swal from "sweetalert";
import { alertt_success } from "../../actions/AlertAction";
import Tooltip from "@mui/material/Tooltip";

import "./comment.css";
import {
  convertTimestampToHumanTime,
  convertTimestampToDateTime,
} from "../../helpers/helper";
import { backDropOn, backDropOFF } from "../../actions/backDropAction";
import { removeComment } from "../../api/CommentRequest";

const Comment = ({ data, handleDeleteComment }) => {
  console.log(data);
  const currentUser = JSON.parse(localStorage.getItem("profile"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="card-comment-header">
        <div className="comment-header">
          <img
            src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${data.avatar}`}
            alt=""
            className="image-comment-header"
          />
          <div className="detail-comment-header">
            <span className="user-comment">{data.firstName}</span>{" "}
            <span className="content-comment">{data.content}</span>
            <br />
            <Tooltip title={convertTimestampToDateTime(data.creatAt)}>
              <span className="createTime-comment">
                {convertTimestampToHumanTime(data.creatAt)}
              </span>
            </Tooltip>
          </div>
          {data.userId === currentUser.data._id ? (
            <>
              <MoreHorizIcon onClick={handleClick}></MoreHorizIcon>

              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  horizontal: "center",
                }}
              >
                <Typography
                  className="btn-edipost"
                  sx={{ p: 2 }}
                  onClick={() => {
                    handleDeleteComment(currentUser, data);
                  }}
                >
                  Delete Post.
                </Typography>
              </Popover>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;
