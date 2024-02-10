"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
class Channel {
    get getId() {
        return this.id;
    }
    set setId(id) {
        this.id = id;
    }
    get getName() {
        return this.name;
    }
    set setName(name) {
        this.name = name;
    }
    get getDescription() {
        return this.description;
    }
    set setDescription(description) {
        this.description = description;
    }
    get getCreatedAt() {
        return this.createdAt;
    }
    set setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }
    get getUpdatedAt() {
        return this.updatedAt;
    }
    set setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }
    get getDeletedAt() {
        return this.deletedAt;
    }
    set setDeletedAt(deletedAt) {
        this.deletedAt = deletedAt;
    }
    get getVideos() {
        return this.videos;
    }
    set setVideos(videos) {
        this.videos = videos;
    }
    addVideo(video) {
        this.videos.add(video);
    }
    removeVideo(video) {
        this.videos.delete(video);
    }
}
exports.Channel = Channel;
