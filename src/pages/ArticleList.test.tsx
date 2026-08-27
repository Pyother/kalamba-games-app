import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { getArticles } from "api/articles/getArticles";
import { AuthProvider } from "context/AuthContext";
import type { ArticleType } from "types";

import ArticleList from "./ArticleList";

jest.mock("api/articles/getArticles", () => ({
  getArticles: jest.fn(),
}));

const mockedGetArticles = getArticles as jest.MockedFunction<typeof getArticles>;

const article: ArticleType = {
  author: {
    bio: "Author bio",
    following: false,
    image: "",
    username: "alice",
  },
  body: "Article body",
  createdAt: "2021-04-08T00:00:00.000Z",
  description: "Article description",
  favorited: false,
  favoritesCount: 3,
  slug: "example-article",
  tagList: [],
  title: "Example article",
  updatedAt: "2021-04-08T00:00:00.000Z",
};

test("renders articles loaded from the API", async () => {
  mockedGetArticles.mockResolvedValue({ articles: [article], articlesCount: 1 });

  render(
    <MemoryRouter>
      <AuthProvider>
        <ArticleList />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByText("Loading articles...")).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Example article" })).toBeInTheDocument();
  expect(screen.getByText("Article description")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "alice" })).toHaveAttribute("href", "/profile/alice");
});
