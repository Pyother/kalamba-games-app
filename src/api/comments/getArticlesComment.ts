import { request } from "lib/request";
import type { CommentsResponseType } from "types";

export function getArticleComments(slug: string): Promise<CommentsResponseType> {
    return request<CommentsResponseType>(`/articles/${encodeURIComponent(slug)}/comments`);
}
