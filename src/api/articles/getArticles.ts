import { request } from "lib/request";
import type { ArticleFilters, ArticlesResponse } from "types";

export function getArticles(filters: ArticleFilters = {}): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([name, value]) => {
        if (value !== undefined) {
            searchParams.set(name, String(value));
        }
    });

    const query = searchParams.toString();
    return request<ArticlesResponse>(`/articles${query ? `?${query}` : ""}`);
}
