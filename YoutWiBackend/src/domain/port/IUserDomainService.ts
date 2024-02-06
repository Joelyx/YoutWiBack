import { User } from "../models/user";

interface IUserDomainService {
    save(user: User): Promise<User | null>;
    deleteById(id: number): void;
    findById(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findByUid(uid: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findByGoogleIdOrCreate(googleId: string, user: User): Promise< User | null>;
}

export { IUserDomainService };
