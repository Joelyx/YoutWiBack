import { IUserRepository } from "../port/secondary/IUserRepository";
import { User } from "../models/User";
import {inject, injectable} from "inversify";
import {Types} from "../../infrastructure/config/Types";
import {IUserDomainService} from "../port/primary/IUserDomainService";

@injectable() // Esto hace que UserDomainService sea un servicio inyectable
class UserDomainService implements IUserDomainService{
    private repository: IUserRepository;
    constructor(@inject(Types.IUserRepository) repository: IUserRepository) {
        this.repository = repository;
    }
    save = (user: User) => this.repository.save(user);
    register = (user: User) => this.repository.register(user);
    deleteById = (id: number) => this.repository.deleteById(id);
    findById = (id: number) => this.repository.findById(id);
    findByUsername = (username: string) => this.repository.findByUsername(username);
    findByEmail = (email: string) => this.repository.findByEmail(email);
    findAll = () => this.repository.findAll();
    findByUid = (uid: string) => this.repository.findByUid(uid);
    findByGoogleId = (googleId: string) => this.repository.findByGoogleId(googleId);
    findByGoogleIdOrCreate = (googleId: string, user: User) => this.repository.findByGoogleIdOrCreate(googleId, user);
    findStartsWithUsername = (username: string) => this.repository.findStartsWithUsername(username);
    followOrUnfollowUser = (followerUser: User, followedUser: User) => this.repository.followOrUnfollowUser(followerUser, followedUser);
    checkIfFollowsUser = (followerUser: User, followedUser: User) => this.repository.checkIfFollowsUser(followerUser, followedUser);
}

export { UserDomainService };
