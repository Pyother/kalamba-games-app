import { request } from "lib/request";
import type { ArticleResponse } from "types";

export function unfavoriteArticle(slug: string): Promise<ArticleResponse> {
    return request<ArticleResponse>(`/articles/${encodeURIComponent(slug)}/favorite`, {
        method: "DELETE",
    });
}
