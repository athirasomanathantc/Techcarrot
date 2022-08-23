export interface ICommentItem {
    ID: number;
    Title: string;
    Comment: string;
    CommentAuthor: {
        Title: string;
        Id: number;
    };
    ParentCommentID: number;
    Created: Date;
    CommentLikedBy: string;
}