import { User } from "../../../../domain/models/User";
import {IUserRepository} from "../../../../domain/port/secondary/IUserRepository";
import UserEntityRepository from "../../../repositories/mysql/UserEntityRepository";
import {UserEntity} from "../../../entity/UserEntity";
import {Service} from "typedi";
import {injectable} from "inversify";
import {executeQuery} from "../../../config/Neo4jDataSource";

@injectable()
export class UserDatabaseService implements IUserRepository {
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

    async register(user: User): Promise<User | null> {
        const userEntity = this.mapUserToUserEntity(user);
        const userProps = this.mapUserToNeo4jProperties(user);
        const query = `
            CREATE (u:User {id: $id, email: $email, name: $name})
            RETURN u
        `;
        try {
            const savedUserEntity = await this.userRepository.save(userEntity);
            userProps.id = savedUserEntity.id;
            const result = await executeQuery(query, userProps);
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
            console.log(userEntity);
            if (userEntity !== null) {
                return this.mapUserEntityToUser(userEntity);
            }
            return null;
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
                const userProps = this.mapUserToNeo4jProperties(user);
                const query = `
            CREATE (u:User {id: $id, email: $email, name: $name})
            RETURN u
        `;
                userEntity.googleId = googleId;
                const savedUserEntity = await this.userRepository.save(userEntity);
                userProps.id = savedUserEntity.id;
                const result = await executeQuery(query, userProps);
                return this.mapUserEntityToUser(savedUserEntity);
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findStartsWithUsername(username: string): Promise<User[]> {
        try {
            const usersEntity = await this.userRepository.findStartsWithUsername(username);
            return usersEntity.map(userEntity => this.mapUserEntityToUser(userEntity));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async followOrUnfollowUser(followerUser: User, followedUser: User): Promise<void> {

        const query = `
        OPTIONAL MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followed:User {id: $followedId})
        WITH follower, followed, r
        WHERE r IS NOT NULL
        DELETE r
        WITH follower, followed
        WHERE NOT EXISTS ((follower)-[:FOLLOWS]->(followed))
        CREATE (follower)-[:FOLLOWS]->(followed)
    `;

        const params = {
            followerId: followerUser.getId,
            followedId: followedUser.getId
        };

        try {
            await executeQuery(query, params);
        } catch (error) {
            console.error('Error en followOrUnfollowUser:', error);
        }
    }

    async checkIfFollowsUser(followerUser: User, followedUser: User): Promise<boolean> {
        const query = `
        MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followed:User {id: $followedId})
        RETURN EXISTS( (follower)-[:FOLLOWS]->(followed) ) AS follows
    `;

        const params = {
            followerId: followerUser.getId,
            followedId: followedUser.getId
        };

        try {
            const result = await executeQuery(query, params);
            if (result.length > 0) {
                return result[0].get('follows');
            }
            return false;
        } catch (error) {
            console.error('Error en checkIfFollowsUser:', error);
            return false;
        }
    }




    mapUserToUserEntity(user: User): UserEntity {

        const userEntity = new UserEntity();
        userEntity.id = user.getId;
        userEntity.googleId = user.getGoogleId;
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

    mapUserToNeo4jProperties(user: User): any {
        return {
            id: user.getId,
            email: user.getEmail,
            name: user.getUsername,
        };
    }

    mapUserEntityToUser(userEntity: UserEntity): User {
        const user = new User();
        user.setId = userEntity.id;
        user.setUsername = userEntity.username;
        user.setGoogleId = userEntity.googleId;
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