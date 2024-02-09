import {Channel} from "./Channel";


export class Video{
    private id: string;
    private title: string;
    private channel: Channel
    private createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date;

    get getId(): string {
        return this.id;
    }

    set setId(id: string) {
        this.id = id;
    }

    get getTitle(): string {
        return this.title;
    }

    set setTitle(title: string) {
        this.title = title;
    }

    get getChannel(): Channel {
        return this.channel;
    }

    set setChannel(channel: Channel) {
        this.channel = channel;
    }

    get getCreatedAt(): Date {
        return this.createdAt;
    }

    set setCreatedAt(createdAt: Date) {
        this.createdAt = createdAt;
    }

    get getUpdatedAt(): Date {
        return this.updatedAt;
    }

    set setUpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    get getDeletedAt(): Date {
        return this.deletedAt;
    }

    set setDeletedAt(deletedAt: Date) {
        this.deletedAt = deletedAt;
    }
}