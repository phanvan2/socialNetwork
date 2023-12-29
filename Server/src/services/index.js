import UserService from "./UserService";
import ContactService from "./ContactService";
import NotificationService from "./NotificationService";
import PostService from "./PostService";
import ResearchService from "./ResearchService";
import CommentService from "./CommentService";
import LikeService from "./LikeService";
import train_model from "./train_model";

export const User = UserService ; 
export const Contact = ContactService; 
export const Notification = NotificationService; 
export const Post = PostService ; 
export const Research = ResearchService ; 
export const Comment = CommentService ; 
export const Like = LikeService; 
export const train = train_model ; 
