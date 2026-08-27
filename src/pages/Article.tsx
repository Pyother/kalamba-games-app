import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { getArticle } from "api/articles/getArticle";
import { favoriteArticle } from "api/favorites/favoriteArticle";
import { unfavoriteArticle } from "api/favorites/unfavoriteArticle";
import { followProfile } from "api/profiles/followProfile";
import { unfollowProfile } from "api/profiles/unfollowProfile";
import ArticleMeta from "components/articles/ArticleMeta";
import { useAuth } from "context/AuthContext";
import type { ArticleType } from "types";

interface ArticleRouteParams {
  slug: string;
}

type PendingAction = "favorite" | "follow" | null;

export default function Article(): JSX.Element {
  const history = useHistory();
  const { slug } = useParams<ArticleRouteParams>();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

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

  const requireAuthentication = (): boolean => {
    if (isAuthenticated) {
      return true;
    }

    history.push("/login", { from: `/${slug}` });
    return false;
  };

  const handleFavoriteToggle = async (): Promise<void> => {
    if (!article || !requireAuthentication()) {
      return;
    }

    setActionError(null);
    setPendingAction("favorite");

    try {
      const response = article.favorited ? await unfavoriteArticle(article.slug) : await favoriteArticle(article.slug);

      setArticle(response.article);
    } catch {
      setActionError("Unable to update this favorite. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleFollowToggle = async (): Promise<void> => {
    if (!article || !requireAuthentication()) {
      return;
    }

    setActionError(null);
    setPendingAction("follow");

    try {
      const response = article.author.following
        ? await unfollowProfile(article.author.username)
        : await followProfile(article.author.username);

      setArticle(currentArticle => (currentArticle ? { ...currentArticle, author: response.profile } : currentArticle));
    } catch {
      setActionError("Unable to update the followed author. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

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
          <ArticleMeta
            article={article}
            isDisabled={isAuthLoading || pendingAction !== null}
            isFavoritePending={pendingAction === "favorite"}
            isFollowPending={pendingAction === "follow"}
            onFavoriteToggle={handleFavoriteToggle}
            onFollowToggle={handleFollowToggle}
          />
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

        {actionError && (
          <div className="error-messages text-xs-center" role="alert">
            {actionError}
          </div>
        )}

        <div className="article-actions">
          <ArticleMeta
            article={article}
            isDisabled={isAuthLoading || pendingAction !== null}
            isFavoritePending={pendingAction === "favorite"}
            isFollowPending={pendingAction === "follow"}
            onFavoriteToggle={handleFavoriteToggle}
            onFollowToggle={handleFollowToggle}
          />
        </div>
      </div>
    </div>
  );
}
