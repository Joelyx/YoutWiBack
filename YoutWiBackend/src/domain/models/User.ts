

export class User {
    private id: number;
    private googleId: string;
    private username: string;
    private password: string;
    private uid: string;
    private active: boolean;
    private role: string;
    private friends: Set<number>;
    private email: string;
    private createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date;
    

    get getId(): number {
        return this.id;
    }

    set setId(id: number) {
        this.id = id;
    }

    get getUsername(): string {
        return this.username;
    }

    set setUsername(username: string) {
        this.username = username;
    }

    get getPassword(): string {
        return this.password;
    }

    set setPassword(password: string) {
        this.password = password;
    }

    get getRole(): string {
        return this.role;
    }

    set setRole(role: string) {
        this.role = role;
    }

    get getEmail(): string {
        return this.email;
    }

    set setEmail(email: string) {
        this.email = email;
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

    get getFriends(): Set<number> {
        return this.friends;
    }

    set setFriends(friends: Set<number>) {
        this.friends = friends;
    }

    get getUid(): string {
        return this.uid;
    }

    set setUid(uid: string) {
        this.uid = uid;
    }

    get getActive(): boolean {
        return this.active;
    }

    set setActive(active: boolean) {
        this.active = active;
    }

    get getGoogleId(): string {
        return this.googleId;
    }

    set setGoogleId(googleId: string) {
        this.googleId = googleId;
    }
}

