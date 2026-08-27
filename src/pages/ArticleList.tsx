import { useEffect, useState } from "react";

import { getArticles } from "api/articles/getArticles";
import ArticlePreview from "components/articles/ArticlePreview";
import type { ArticleType } from "types";

export default function ArticleList(): JSX.Element {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    getArticles()
      .then(response => {
        if (isActive) {
          setArticles(response.articles);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Unable to load articles. Please try again later.");
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
  }, []);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <span className="nav-link disabled">Your Feed</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link active">Global Feed</span>
                </li>
              </ul>
            </div>

            {isLoading && <div className="article-preview">Loading articles...</div>}
            {error && (
              <div className="article-preview" role="alert">
                {error}
              </div>
            )}
            {!isLoading && !error && articles.length === 0 && (
              <div className="article-preview">No articles are here... yet.</div>
            )}
            {!isLoading && !error && articles.map(article => <ArticlePreview article={article} key={article.slug} />)}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {["programming", "javascript", "emberjs", "angularjs", "react", "mean", "node", "rails"].map(tag => (
                  <span className="tag-pill tag-default" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
