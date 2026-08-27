import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { loginUser } from "api/users/loginUser";
import { AuthProvider } from "context/AuthContext";

import Login from "./Login";

jest.mock("api/users/loginUser", () => ({
  loginUser: jest.fn(),
}));

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("logs in, stores the token and redirects home", async () => {
  mockedLoginUser.mockResolvedValue({
    user: {
      bio: "I am Alice",
      email: "alice@example.com",
      image: "",
      token: "test-token",
      username: "alice",
    },
  });

  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/">
            Home page
          </Route>
        </Switch>
      </AuthProvider>
    </MemoryRouter>
  );

  userEvent.type(await screen.findByPlaceholderText("Email"), "alice@example.com");
  userEvent.type(screen.getByPlaceholderText("Password"), "I_<3-R0ber7");
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  expect(await screen.findByText("Home page")).toBeInTheDocument();
  expect(mockedLoginUser).toHaveBeenCalledWith({
    email: "alice@example.com",
    password: "I_<3-R0ber7",
  });
  expect(localStorage.getItem("token")).toBe("test-token");
});
