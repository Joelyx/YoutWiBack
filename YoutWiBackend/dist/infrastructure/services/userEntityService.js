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
exports.UserEntityService = void 0;
const user_1 = require("../../domain/models/user");
const userEntityRepository_1 = __importDefault(require("../repositories/mysql/userEntityRepository"));
const userEntity_1 = require("../entity/userEntity");
const inversify_1 = require("inversify");
let UserEntityService = class UserEntityService {
    constructor() {
        this.userRepository = userEntityRepository_1.default;
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
                return userEntity ? this.mapUserEntityToUser(userEntity) : null;
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
                    userEntity.googleId = googleId;
                    const savedUserEntity = yield this.userRepository.save(userEntity);
                    return this.mapUserEntityToUser(savedUserEntity);
                }
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    mapUserToUserEntity(user) {
        const userEntity = new userEntity_1.UserEntity();
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
    mapUserEntityToUser(userEntity) {
        const user = new user_1.User();
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
};
exports.UserEntityService = UserEntityService;
exports.UserEntityService = UserEntityService = __decorate([
    (0, inversify_1.injectable)()
], UserEntityService);
