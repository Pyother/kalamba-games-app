import type { SyntheticEvent } from "react";
import { Link } from "react-router-dom";

import { formatDate } from "lib/formatDate";
import type { ArticleType } from "types";

interface ArticlePreviewProps {
  article: ArticleType;
}

const defaultAvatar = `${process.env.PUBLIC_URL}/default-avatar.svg`;

export default function ArticlePreview({ article }: ArticlePreviewProps): JSX.Element {
  const profilePath = `/profile/${encodeURIComponent(article.author.username)}`;

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultAvatar;
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={profilePath}>
          <img
            alt={`${article.author.username}'s avatar`}
            onError={handleImageError}
            src={article.author.image || defaultAvatar}
          />
        </Link>
        <div className="info">
          <Link className="author" to={profilePath}>
            {article.author.username}
          </Link>
          <time className="date" dateTime={article.createdAt}>
            {formatDate(article.createdAt)}
          </time>
        </div>
        <button
          aria-label={`${article.favorited ? "Unfavorite" : "Favorite"} ${article.title}`}
          aria-pressed={article.favorited}
          className={`btn btn-sm pull-xs-right ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
          type="button"
        >
          <i className="ion-heart" /> {article.favoritesCount}
        </button>
      </div>
      <Link className="preview-link" to={`/${encodeURIComponent(article.slug)}`}>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
