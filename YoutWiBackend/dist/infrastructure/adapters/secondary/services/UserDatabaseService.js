"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatabaseService = void 0;
const User_1 = require("../../../../domain/models/User");
const UserEntityRepository_1 = __importDefault(require("../../../repositories/mysql/UserEntityRepository"));
const UserEntity_1 = require("../../../entity/UserEntity");
const inversify_1 = require("inversify");
const Neo4jDataSource_1 = require("../../../config/Neo4jDataSource");
let UserDatabaseService = class UserDatabaseService {
    constructor() {
        this.userRepository = UserEntityRepository_1.default;
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEntity = this.mapUserToUserEntity(user);
            try {
                const savedUserEntity = yield this.userRepository.save(userEntity);
                return this.mapUserEntityToUser(savedUserEntity);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEntity = this.mapUserToUserEntity(user);
            const userProps = this.mapUserToNeo4jProperties(user);
            const query = `
            CREATE (u:User {id: $id, email: $email, name: $name})
            RETURN u
        `;
            try {
                const savedUserEntity = yield this.userRepository.save(userEntity);
                userProps.id = savedUserEntity.id;
                const result = yield (0, Neo4jDataSource_1.executeQuery)(query, userProps);
                return this.mapUserEntityToUser(savedUserEntity);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.deleteById(id);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findById(id);
                return userEntity ? this.mapUserEntityToUser(userEntity) : null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findByUsername(username);
                return userEntity ? this.mapUserEntityToUser(userEntity) : null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findByEmail(email);
                console.log(userEntity);
                if (userEntity !== null) {
                    return this.mapUserEntityToUser(userEntity);
                }
                return null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersEntity = yield this.userRepository.findAll();
                return usersEntity.map(userEntity => this.mapUserEntityToUser(userEntity));
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    findByUid(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findByUid(uid);
                return userEntity ? this.mapUserEntityToUser(userEntity) : null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findByGoogleId(googleId);
                return userEntity ? this.mapUserEntityToUser(userEntity) : null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findByGoogleIdOrCreate(googleId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findByGoogleId(googleId);
                if (userEntity) {
                    return this.mapUserEntityToUser(userEntity);
                }
                else {
                    const userEntity = this.mapUserToUserEntity(user);
                    const userProps = this.mapUserToNeo4jProperties(user);
                    const query = `
            CREATE (u:User {id: $id, email: $email, name: $name})
            RETURN u
        `;
                    userEntity.googleId = googleId;
                    const savedUserEntity = yield this.userRepository.save(userEntity);
                    userProps.id = savedUserEntity.id;
                    const result = yield (0, Neo4jDataSource_1.executeQuery)(query, userProps);
                    return this.mapUserEntityToUser(savedUserEntity);
                }
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findStartsWithUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersEntity = yield this.userRepository.findStartsWithUsername(username);
                return usersEntity.map(userEntity => this.mapUserEntityToUser(userEntity));
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    followOrUnfollowUser(followerUser, followedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultDelete = yield (0, Neo4jDataSource_1.executeQuery)(`OPTIONAL MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followed:User {id: $followedId})
            DELETE r
            RETURN COUNT(r) as deletedCount`, {
                    followerId: followerUser.getId,
                    followedId: followedUser.getId
                });
                const deletedCount = resultDelete[0].get('deletedCount').toNumber();
                if (deletedCount === 0) {
                    yield (0, Neo4jDataSource_1.executeQuery)(`MATCH (follower:User {id: $followerId}), (followed:User {id: $followedId})
                WHERE NOT (follower)-[:FOLLOWS]->(followed)
                CREATE (follower)-[:FOLLOWS]->(followed)`, {
                        followerId: followerUser.getId,
                        followedId: followedUser.getId
                    });
                }
            }
            catch (error) {
                console.error('Error en followOrUnfollowUser:', error);
            }
        });
    }
    findFollowingUsers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        MATCH (follower:User {id: $id})-[:FOLLOWS]->(followed:User)
        RETURN followed
    `;
            const params = {
                id: user.getId
            };
            try {
                const result = yield (0, Neo4jDataSource_1.executeQuery)(query, params);
                return result.map(record => this.mapUserNeoToUser(record.get('followed').properties));
            }
            catch (error) {
                console.error('Error en findFollowingUsers:', error);
                return [];
            }
        });
    }
    findFollowers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        MATCH (follower:User)-[:FOLLOWS]->(followed:User {id: $id})
        RETURN follower
    `;
            const params = {
                id: user.getId
            };
            try {
                const result = yield (0, Neo4jDataSource_1.executeQuery)(query, params);
                return result.map(record => this.mapUserNeoToUser(record.get('follower').properties));
            }
            catch (error) {
                console.error('Error en findFollowers:', error);
                return [];
            }
        });
    }
    checkIfFollowsUser(followerUser, followedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followed:User {id: $followedId})
        RETURN EXISTS( (follower)-[:FOLLOWS]->(followed) ) AS follows
    `;
            const params = {
                followerId: followerUser.getId,
                followedId: followedUser.getId
            };
            try {
                const result = yield (0, Neo4jDataSource_1.executeQuery)(query, params);
                if (result.length > 0) {
                    return result[0].get('follows');
                }
                return false;
            }
            catch (error) {
                console.error('Error en checkIfFollowsUser:', error);
                return false;
            }
        });
    }
    mapUserToUserEntity(user) {
        const userEntity = new UserEntity_1.UserEntity();
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
    mapUserToNeo4jProperties(user) {
        return {
            id: user.getId,
            email: user.getEmail,
            name: user.getUsername,
        };
    }
    mapUserEntityToUser(userEntity) {
        var _a;
        const user = new User_1.User();
        user.setId = userEntity.id;
        user.setUsername = userEntity.username;
        user.setGoogleId = (_a = userEntity.googleId) !== null && _a !== void 0 ? _a : "";
        user.setPassword = userEntity.password;
        user.setRole = userEntity.roles;
        user.setEmail = userEntity.email;
        user.setCreatedAt = userEntity.createdAt;
        user.setUpdatedAt = userEntity.updatedAt;
        if (userEntity.deletedAt != null) {
            user.setDeletedAt = userEntity.deletedAt;
        }
        user.setUid = userEntity.uid;
        user.setActive = userEntity.active;
        return user;
    }
    mapUserNeoToUser(entity) {
        const user = new User_1.User();
        user.setId = entity.id;
        user.setUsername = entity.name;
        return user;
    }
    updateActive(id, active) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEntity = yield this.userRepository.findById(id);
                if (!userEntity) {
                    console.error('User not found');
                    return null;
                }
                userEntity.active = active;
                const updatedUserEntity = yield this.userRepository.save(userEntity);
                return this.mapUserEntityToUser(updatedUserEntity);
            }
            catch (error) {
                console.error('Error updating user active status:', error);
                return null;
            }
        });
    }
};
exports.UserDatabaseService = UserDatabaseService;
exports.UserDatabaseService = UserDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], UserDatabaseService);
