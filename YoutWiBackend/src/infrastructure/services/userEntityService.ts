import { User } from "../../domain/models/user";
import {IUserRepository} from "../../domain/port/iUserRepository";
import UserEntityRepository from "../repositories/mysql/userEntityRepository";
import {UserEntity} from "../entity/userEntity";
import {Service} from "typedi";
import {injectable} from "inversify";

@injectable()
export class UserEntityService implements IUserRepository {
    private userRepository = UserEntityRepository;

    async save(user: User): Promise<User | null> {
        const userEntity = this.mapUserToUserEntity(user);
        try {
            const savedUserEntity = await this.userRepository.save(userEntity);
            return this.mapUserEntityToUser(savedUserEntity);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteById(id: number): Promise<void> {
        await this.userRepository.deleteById(id);
    }

    async findById(id: number): Promise<User | null> {
        try {
            const userEntity = await this.userRepository.findById(id);
            return userEntity ? this.mapUserEntityToUser(userEntity) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            const userEntity = await this.userRepository.findByUsername(username);
            return userEntity ? this.mapUserEntityToUser(userEntity) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const userEntity = await this.userRepository.findByEmail(email);
            return userEntity ? this.mapUserEntityToUser(userEntity) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const usersEntity = await this.userRepository.findAll();
            return usersEntity.map(userEntity => this.mapUserEntityToUser(userEntity));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async findByUid(uid: string): Promise<User | null> {
        try {
            const userEntity = await this.userRepository.findByUid(uid);
            return userEntity ? this.mapUserEntityToUser(userEntity) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        try {
            const userEntity = await this.userRepository.findByGoogleId(googleId);
            return userEntity ? this.mapUserEntityToUser(userEntity) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findByGoogleIdOrCreate(googleId: string, user: User): Promise<User | null> {
        try {
            const userEntity = await this.userRepository.findByGoogleId(googleId);
            if (userEntity) {
                return this.mapUserEntityToUser(userEntity);
            } else {
                const userEntity = this.mapUserToUserEntity(user);
                userEntity.googleId = googleId;
                const savedUserEntity = await this.userRepository.save(userEntity);
                return this.mapUserEntityToUser(savedUserEntity);
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    mapUserToUserEntity(user: User): UserEntity {

        const userEntity = new UserEntity();
        userEntity.id = user.getId;
        userEntity.username = user.getUsername;
        userEntity.password = user.getPassword;
        userEntity.roles = user.getRole;
        userEntity.email = user.getEmail;
        userEntity.createdAt = user.getCreatedAt;
        userEntity.updatedAt = user.getUpdatedAt;
        userEntity.deletedAt = user.getDeletedAt;
        userEntity.uid = user.getUid;
        userEntity.active = user.getActive;
        return userEntity;
    }

    mapUserEntityToUser(userEntity: UserEntity): User {
        const user = new User();
        user.setId = userEntity.id;
        user.setUsername = userEntity.username;
        user.setPassword = userEntity.password;
        user.setRole = userEntity.roles;
        user.setEmail = userEntity.email;
        user.setCreatedAt = userEntity.createdAt;
        user.setUpdatedAt = userEntity.updatedAt;
        user.setDeletedAt = userEntity.deletedAt;
        user.setUid = userEntity.uid;
        user.setActive = userEntity.active;
        return user;
    }



}