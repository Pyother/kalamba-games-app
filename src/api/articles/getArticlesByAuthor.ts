import type { ArticlesResponse } from "types";

import { getArticles } from "./getArticles";

export function getArticlesByAuthor(username: string): Promise<ArticlesResponse> {
    return getArticles({ author: username });
}
