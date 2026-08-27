import { Link } from "react-router-dom";

import { formatDate } from "lib/formatDate";
import type { ArticleType } from "types";

import Avatar from "components/common/Avatar";

interface ArticleMetaProps {
  article: ArticleType;
}

export default function ArticleMeta({ article }: ArticleMetaProps): JSX.Element {
  const { author } = article;
  const profilePath = `/profile/${encodeURIComponent(author.username)}`;

  return (
    <div className="article-meta">
      <Link to={profilePath}>
        <Avatar image={author.image} username={author.username} />
      </Link>
      <div className="info">
        <Link className="author" to={profilePath}>
          {author.username}
        </Link>
        <time className="date" dateTime={article.createdAt}>
          {formatDate(article.createdAt)}
        </time>
      </div>
      <button
        aria-pressed={author.following}
        className={`btn btn-sm ${author.following ? "btn-secondary" : "btn-outline-secondary"}`}
        type="button"
      >
        <i className="ion-plus-round" />
        &nbsp; {author.following ? "Unfollow" : "Follow"} {author.username}
      </button>
      &nbsp;&nbsp;
      <button
        aria-pressed={article.favorited}
        className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
        type="button"
      >
        <i className="ion-heart" />
        &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Post
        <span className="counter"> ({article.favoritesCount})</span>
      </button>
    </div>
  );
}
