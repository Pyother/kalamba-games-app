import { request } from "lib/request";
import type { LoginUserType, UserResponseType } from "types";

export function loginUser(credentials: LoginUserType): Promise<UserResponseType> {
    return request<UserResponseType>("/users/login", {
        method: "POST",
        body: JSON.stringify({ user: credentials }),
    });
}
