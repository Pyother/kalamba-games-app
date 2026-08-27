import { request } from "lib/request";
import type { ProfileResponse } from "types";

export function followProfile(username: string): Promise<ProfileResponse> {
    return request<ProfileResponse>(`/profiles/${encodeURIComponent(username)}/follow`, {
        method: "POST",
    });
}
