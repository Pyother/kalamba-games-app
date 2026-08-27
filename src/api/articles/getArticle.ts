import { request } from "lib/request";
import type { ArticleResponse } from "types";

export function getArticle(slug: string): Promise<ArticleResponse> {
    return request<ArticleResponse>(`/articles/${encodeURIComponent(slug)}`);
}
