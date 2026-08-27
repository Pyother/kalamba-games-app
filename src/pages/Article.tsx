import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getArticle } from "api/articles/getArticle";
import ArticleMeta from "components/articles/ArticleMeta";
import type { ArticleType } from "types";

interface ArticleRouteParams {
  slug: string;
}

export default function Article(): JSX.Element {
  const { slug } = useParams<ArticleRouteParams>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    setArticle(null);
    setError(null);
    setIsLoading(true);

    getArticle(slug)
      .then(response => {
        if (isActive) {
          setArticle(response.article);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Unable to load this article. Please try again later.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="container page" role="alert">
          {error ?? "Article not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p style={{ whiteSpace: "pre-wrap" }}>{article.body}</p>

            {article.tagList.length > 0 && (
              <ul className="tag-list">
                {article.tagList.map(tag => (
                  <li className="tag-default tag-pill tag-outline" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={article} />
        </div>
      </div>
    </div>
  );
}
