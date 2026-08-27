import type { CommentType } from "./CommentType";

export interface CommentResponseType {
    comment: CommentType;
}

export interface CommentsResponseType {
    comments: CommentType[];
}
