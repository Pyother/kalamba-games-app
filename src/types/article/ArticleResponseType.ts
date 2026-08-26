import { ArticleType } from "./ArticleType";

export interface ArticlesResponse {
    articles: ArticleType[];
    articlesCount: number;
}

export interface ArticleResponse {
     article: ArticleType;
}
