import { User } from '../../models/User';

interface IUserRepository {
    save(user: User): Promise<User | null>;
    register(user: User): Promise<User | null>;
    deleteById(id: number): Promise<void>;
    findById(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findByUid(uid: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findByGoogleIdOrCreate(googleId: string, user: User): Promise<User | null>;
    findStartsWithUsername(username: string): Promise<User[]>;
    followOrUnfollowUser(followerUser: User, followedUser: User): Promise<void>;
    findFollowingUsers(user: User): Promise<User[]>;
    findFollowers(user: User): Promise<User[]>;
    checkIfFollowsUser(followerUser: User, followedUser: User): Promise<boolean>;
    updateActive(id: number, active: boolean): Promise<User | null>;
    count(): Promise<number>;
}

export { IUserRepository };
