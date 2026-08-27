import { request } from "lib/request";
import type { CommentResponseType, NewCommentType } from "types";

export function createArticleComment(slug: string, comment: NewCommentType): Promise<CommentResponseType> {
  return request<CommentResponseType>(`/articles/${encodeURIComponent(slug)}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}
