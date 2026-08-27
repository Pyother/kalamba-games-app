import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";

import { getArticle } from "api/articles/getArticle";
import { favoriteArticle } from "api/favorites/favoriteArticle";
import { followProfile } from "api/profiles/followProfile";
import { getCurrentUser } from "api/users/getCurrentUser";
import { AuthProvider } from "context/AuthContext";
import type { ArticleType } from "types";

import Article from "./Article";

jest.mock("api/articles/getArticle", () => ({
  getArticle: jest.fn(),
}));
jest.mock("api/favorites/favoriteArticle", () => ({
  favoriteArticle: jest.fn(),
}));
jest.mock("api/profiles/followProfile", () => ({
  followProfile: jest.fn(),
}));
jest.mock("api/users/getCurrentUser", () => ({
  getCurrentUser: jest.fn(),
}));

const mockedGetArticle = getArticle as jest.MockedFunction<typeof getArticle>;
const mockedFavoriteArticle = favoriteArticle as jest.MockedFunction<typeof favoriteArticle>;
const mockedFollowProfile = followProfile as jest.MockedFunction<typeof followProfile>;
const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

const article: ArticleType = {
  author: {
    bio: "Author bio",
    following: false,
    image: "",
    username: "alice",
  },
  body: "Full article body",
  createdAt: "2021-04-08T00:00:00.000Z",
  description: "Article description",
  favorited: false,
  favoritesCount: 3,
  slug: "example-article",
  tagList: ["react"],
  title: "Example article",
  updatedAt: "2021-04-08T00:00:00.000Z",
};

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renders an article loaded for the slug from the URL", async () => {
  mockedGetArticle.mockResolvedValue({ article });

  render(
    <MemoryRouter initialEntries={["/example-article"]}>
      <AuthProvider>
        <Route path="/:slug">
          <Article />
        </Route>
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByText("Loading article...")).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Example article" })).toBeInTheDocument();
  expect(screen.getByText("Full article body")).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "alice" })[0]).toHaveAttribute("href", "/profile/alice");
  expect(mockedGetArticle).toHaveBeenCalledWith("example-article");
});

test("favorites the article and follows its author", async () => {
  localStorage.setItem("token", "test-token");
  mockedGetArticle.mockResolvedValue({ article });
  mockedGetCurrentUser.mockResolvedValue({
    user: {
      bio: "Current user bio",
      email: "bob@example.com",
      image: "",
      token: "test-token",
      username: "bob",
    },
  });
  mockedFavoriteArticle.mockResolvedValue({
    article: { ...article, favorited: true, favoritesCount: 4 },
  });
  mockedFollowProfile.mockResolvedValue({
    profile: { ...article.author, following: true },
  });

  render(
    <MemoryRouter initialEntries={["/example-article"]}>
      <AuthProvider>
        <Route path="/:slug">
          <Article />
        </Route>
      </AuthProvider>
    </MemoryRouter>
  );

  const favoriteButtons = await screen.findAllByRole("button", { name: /Favorite Post/ });
  await waitFor(() => expect(favoriteButtons[0]).toBeEnabled());
  userEvent.click(favoriteButtons[0]);

  expect(await screen.findAllByRole("button", { name: /Unfavorite Post \(4\)/ })).toHaveLength(2);
  expect(mockedFavoriteArticle).toHaveBeenCalledWith("example-article");

  userEvent.click(screen.getAllByRole("button", { name: "Follow alice" })[0]);

  expect(await screen.findAllByRole("button", { name: "Unfollow alice" })).toHaveLength(2);
  expect(mockedFollowProfile).toHaveBeenCalledWith("alice");
});
