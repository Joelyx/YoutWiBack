import {User} from "./User";
import {Video} from "./Video";

export class Post {
    public id: string;
    public title: string;
    public content: string;
    public likes: number;
    public comments: Comment[];
    public user: User;
    public video: Video;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date;
}