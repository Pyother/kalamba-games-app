import { request } from "lib/request";

export function deleteArticleComment(slug: string, id: number): Promise<void> {
    return request<void>(`/articles/${encodeURIComponent(slug)}/comments/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
    });
}
