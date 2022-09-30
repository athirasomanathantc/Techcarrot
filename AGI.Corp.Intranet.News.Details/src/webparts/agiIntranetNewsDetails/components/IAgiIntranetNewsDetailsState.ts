import { ICommentItem } from "../models/ICommentItem";
import { INewsItem } from "../models/INewsItem";

export interface IAgiIntranetNewsDetailsState {
    newsId: number;
    news: INewsItem;
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
    showMoreComments: boolean;
    errorText: string;
    inappropriateWords: string[];
    inappropriateComments: string[];
    inappropriateReply: string[];
}