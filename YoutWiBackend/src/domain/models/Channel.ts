import {Video} from "./Video";


export class Channel {
    private id: string;
    private name: string;
    private description: string;
    private createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date;
    private videos: Set<Video>;

    get getId(): string {
        return this.id;
    }

    set setId(id: string) {
        this.id = id;
    }

    get getName(): string {
        return this.name;
    }

    set setName(name: string) {
        this.name = name;
    }

    get getDescription(): string {
        return this.description;
    }

    set setDescription(description: string) {
        this.description = description;
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

    get getVideos(): Set<Video> {
        return this.videos;
    }

    set setVideos(videos: Set<Video>) {
        this.videos = videos;
    }

    addVideo(video: Video) {
        this.videos.add(video);
    }

    removeVideo(video: Video) {
        this.videos.delete(video);
    }

}