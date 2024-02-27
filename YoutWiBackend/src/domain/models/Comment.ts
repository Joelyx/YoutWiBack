import {User} from "./User";

export class Comment {
    public id: string;
    public content: string;
    public user: User
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date;
}