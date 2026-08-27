import { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { favoriteArticle } from "api/favorites/favoriteArticle";
import { unfavoriteArticle } from "api/favorites/unfavoriteArticle";
import Avatar from "components/common/Avatar";
import { useAuth } from "context/AuthContext";
import { formatDate } from "lib/formatDate";
import type { ArticleType } from "types";

interface ArticlePreviewProps {
  article: ArticleType;
}

export default function ArticlePreview({ article }: ArticlePreviewProps): JSX.Element {
  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState(article);
  const [isPending, setIsPending] = useState(false);
  const profilePath = `/profile/${encodeURIComponent(currentArticle.author.username)}`;

  useEffect(() => {
    setCurrentArticle(article);
  }, [article]);

  const handleFavoriteToggle = async (): Promise<void> => {
    if (!isAuthenticated) {
      history.push("/login", { from: location.pathname });
      return;
    }

    setActionError(null);
    setIsPending(true);

    try {
      const response = currentArticle.favorited
        ? await unfavoriteArticle(currentArticle.slug)
        : await favoriteArticle(currentArticle.slug);

      setCurrentArticle(response.article);
    } catch {
      setActionError("Unable to update favorite.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={profilePath}>
          <Avatar image={currentArticle.author.image} username={currentArticle.author.username} />
        </Link>
        <div className="info">
          <Link className="author" to={profilePath}>
            {currentArticle.author.username}
          </Link>
          <time className="date" dateTime={currentArticle.createdAt}>
            {formatDate(currentArticle.createdAt)}
          </time>
        </div>
        <button
          aria-busy={isPending}
          aria-label={`${currentArticle.favorited ? "Unfavorite" : "Favorite"} ${currentArticle.title}`}
          aria-pressed={currentArticle.favorited}
          className={`btn btn-sm pull-xs-right ${currentArticle.favorited ? "btn-primary" : "btn-outline-primary"}`}
          disabled={isAuthLoading || isPending}
          onClick={handleFavoriteToggle}
          type="button"
        >
          <i className="ion-heart" /> {currentArticle.favoritesCount}
        </button>
      </div>
      {actionError && <div role="alert">{actionError}</div>}
      <Link className="preview-link" to={`/${encodeURIComponent(currentArticle.slug)}`}>
        <h1>{currentArticle.title}</h1>
        <p>{currentArticle.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
