import {Video} from "./Video";
import {User} from "./User";


export class Channel {
    public id: string;
    public title: string;
    public description: string;
    public image: string;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date;
    public videos: Set<Video>;
    public subscribers: Set<User>;

}