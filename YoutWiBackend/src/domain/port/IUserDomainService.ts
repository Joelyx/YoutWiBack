import { User } from "../models/user";

interface IUserDomainService {
    save(user: User): User | null;
    deleteById(id: number): void;
    findById(id: number): User | null;
    findByUsername(username: string): User | null;
    findByEmail(email: string): User | null;
    findAll(): User[];
    findByUid(uid: string): User | null;
    findByGoogleId(googleId: string): User | null;
    findByGoogleIdOrCreate(googleId: string, user: User): User | null;
}

export { IUserDomainService };
