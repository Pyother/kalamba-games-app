import type { ProfileType } from "../profile/ProfileType";

export interface CommentType {
    id: number;
    createdAt: string;
    updatedAt: string;
    body: string;
    author: ProfileType;
}
