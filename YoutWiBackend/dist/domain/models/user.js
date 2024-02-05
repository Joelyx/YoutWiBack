"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    get getId() {
        return this.id;
    }
    set setId(id) {
        this.id = id;
    }
    get getUsername() {
        return this.username;
    }
    set setUsername(username) {
        this.username = username;
    }
    get getPassword() {
        return this.password;
    }
    set setPassword(password) {
        this.password = password;
    }
    get getRole() {
        return this.role;
    }
    set setRole(role) {
        this.role = role;
    }
    get getEmail() {
        return this.email;
    }
    set setEmail(email) {
        this.email = email;
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
    get getFriends() {
        return this.friends;
    }
    set setFriends(friends) {
        this.friends = friends;
    }
    get getUid() {
        return this.uid;
    }
    set setUid(uid) {
        this.uid = uid;
    }
    get getActive() {
        return this.active;
    }
    set setActive(active) {
        this.active = active;
    }
    get getGoogleId() {
        return this.googleId;
    }
    set setGoogleId(googleId) {
        this.googleId = googleId;
    }
}
exports.User = User;
