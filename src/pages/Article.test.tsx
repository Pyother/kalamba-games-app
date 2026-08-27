import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";

import { getArticle } from "api/articles/getArticle";
import type { ArticleType } from "types";

import Article from "./Article";

jest.mock("api/articles/getArticle", () => ({
  getArticle: jest.fn(),
}));

const mockedGetArticle = getArticle as jest.MockedFunction<typeof getArticle>;

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

test("renders an article loaded for the slug from the URL", async () => {
  mockedGetArticle.mockResolvedValue({ article });

  render(
    <MemoryRouter initialEntries={["/example-article"]}>
      <Route path="/:slug">
        <Article />
      </Route>
    </MemoryRouter>
  );

  expect(screen.getByText("Loading article...")).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Example article" })).toBeInTheDocument();
  expect(screen.getByText("Full article body")).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "alice" })[0]).toHaveAttribute("href", "/profile/alice");
  expect(mockedGetArticle).toHaveBeenCalledWith("example-article");
});
