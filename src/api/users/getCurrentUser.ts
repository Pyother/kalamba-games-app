import { request } from "lib/request";
import type { UserResponseType } from "types";

export function getCurrentUser(): Promise<UserResponseType> {
    return request<UserResponseType>("/user");
}
