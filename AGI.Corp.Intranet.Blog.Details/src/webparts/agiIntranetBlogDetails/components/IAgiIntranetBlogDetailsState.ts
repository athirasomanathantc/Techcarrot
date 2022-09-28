import { IBlogItem } from "../models/IBlogItem";
import { ICommentItem } from "../models/ICommentItem";

export interface IAgiIntranetBlogDetailsState {
    blogId: number;
    blog: IBlogItem;
    comment: string;
    reply: string;
    allComments: ICommentItem[];
    comments: ICommentItem[];
    replies: ICommentItem[];
    commentsCount: number;
    viewsCount: number;
    showReplySection: boolean;
    userPicture: string;
    userId: number;
    currentIndex: number;
    blogs: IBlogItem[];
    errorText: string;
    inappropriateWords: string[];
    inappropriateComments: string[];
    inappropriateReply: string[];
}