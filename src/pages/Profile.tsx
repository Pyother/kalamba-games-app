import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { getArticlesByAuthor } from "api/articles/getArticlesByAuthor";
import { followProfile } from "api/profiles/followProfile";
import { getProfile } from "api/profiles/getProfile";
import { unfollowProfile } from "api/profiles/unfollowProfile";
import ArticlePreview from "components/articles/ArticlePreview";
import Avatar from "components/common/Avatar";
import { useAuth } from "context/AuthContext";
import type { ArticleType, ProfileType } from "types";

interface ProfileRouteParams {
  username: string;
}

export default function Profile(): JSX.Element {
  const history = useHistory();
  const { username } = useParams<ProfileRouteParams>();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    let isActive = true;

    setActionError(null);
    setArticles([]);
    setError(null);
    setIsLoading(true);
    setProfile(null);

    Promise.all([getProfile(username), getArticlesByAuthor(username)])
      .then(([profileResponse, articlesResponse]) => {
        if (isActive) {
          setProfile(profileResponse.profile);
          setArticles(articlesResponse.articles);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Unable to load this profile. Please try again later.");
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
  }, [username]);

  const handleFollowToggle = async (): Promise<void> => {
    if (!profile) {
      return;
    }

    if (!isAuthenticated) {
      history.push("/login", { from: `/profile/${encodeURIComponent(username)}` });
      return;
    }

    setActionError(null);
    setIsFollowPending(true);

    try {
      const response = profile.following
        ? await unfollowProfile(profile.username)
        : await followProfile(profile.username);

      setProfile(response.profile);
    } catch {
      setActionError("Unable to update the followed author. Please try again.");
    } finally {
      setIsFollowPending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container page">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="container page" role="alert">
          {error ?? "Profile not found."}
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Avatar className="user-img" image={profile.image} username={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio || "No bio provided."}</p>

              {!isAuthLoading && !isOwnProfile && (
                <button
                  aria-busy={isFollowPending}
                  aria-pressed={profile.following}
                  className={`btn btn-sm action-btn ${profile.following ? "btn-secondary" : "btn-outline-secondary"}`}
                  disabled={isFollowPending}
                  onClick={handleFollowToggle}
                  type="button"
                >
                  <i className={profile.following ? "ion-minus-round" : "ion-plus-round"} />
                  &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
                </button>
              )}

              {actionError && (
                <div className="error-messages" role="alert">
                  {actionError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <span className="nav-link active">Articles</span>
                </li>
              </ul>
            </div>

            {articles.length === 0 && <div className="article-preview">No articles are here... yet.</div>}
            {articles.map(article => (
              <ArticlePreview article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
