import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";

import { getArticlesByAuthor } from "api/articles/getArticlesByAuthor";
import { getProfile } from "api/profiles/getProfile";
import { AuthProvider } from "context/AuthContext";
import type { ArticleType, ProfileType } from "types";

import Profile from "./Profile";

jest.mock("api/articles/getArticlesByAuthor", () => ({
  getArticlesByAuthor: jest.fn(),
}));
jest.mock("api/profiles/getProfile", () => ({
  getProfile: jest.fn(),
}));

const mockedGetArticlesByAuthor = getArticlesByAuthor as jest.MockedFunction<typeof getArticlesByAuthor>;
const mockedGetProfile = getProfile as jest.MockedFunction<typeof getProfile>;

const profile: ProfileType = {
  bio: "Author bio",
  following: false,
  image: "",
  username: "alice",
};

const article: ArticleType = {
  author: profile,
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

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renders a profile and articles written by that author", async () => {
  mockedGetProfile.mockResolvedValue({ profile });
  mockedGetArticlesByAuthor.mockResolvedValue({ articles: [article], articlesCount: 1 });

  render(
    <MemoryRouter initialEntries={["/profile/alice"]}>
      <AuthProvider>
        <Route path="/profile/:username">
          <Profile />
        </Route>
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "alice" })).toBeInTheDocument();
  expect(screen.getByText("Author bio")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Example article" })).toBeInTheDocument();
  expect(mockedGetProfile).toHaveBeenCalledWith("alice");
  expect(mockedGetArticlesByAuthor).toHaveBeenCalledWith("alice");
});
