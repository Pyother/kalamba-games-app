import { Link } from "react-router-dom";

import Avatar from "components/common/Avatar";
import { formatDate } from "lib/formatDate";
import type { ArticleType } from "types";

interface ArticlePreviewProps {
  article: ArticleType;
}

export default function ArticlePreview({ article }: ArticlePreviewProps): JSX.Element {
  const profilePath = `/profile/${encodeURIComponent(article.author.username)}`;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={profilePath}>
          <Avatar image={article.author.image} username={article.author.username} />
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
