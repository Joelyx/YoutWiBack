"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainService = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("../../infrastructure/config/Types");
let UserDomainService = class UserDomainService {
    constructor(repository) {
        this.save = (user) => this.repository.save(user);
        this.register = (user) => this.repository.register(user);
        this.deleteById = (id) => this.repository.deleteById(id);
        this.findById = (id) => this.repository.findById(id);
        this.findByUsername = (username) => this.repository.findByUsername(username);
        this.findByEmail = (email) => this.repository.findByEmail(email);
        this.findAll = () => this.repository.findAll();
        this.findByUid = (uid) => this.repository.findByUid(uid);
        this.findByGoogleId = (googleId) => this.repository.findByGoogleId(googleId);
        this.findByGoogleIdOrCreate = (googleId, user) => this.repository.findByGoogleIdOrCreate(googleId, user);
        this.findStartsWithUsername = (username) => this.repository.findStartsWithUsername(username);
        this.followOrUnfollowUser = (followerUser, followedUser) => this.repository.followOrUnfollowUser(followerUser, followedUser);
        this.findFollowingUsers = (user) => this.repository.findFollowingUsers(user);
        this.findFollowers = (user) => this.repository.findFollowers(user);
        this.checkIfFollowsUser = (followerUser, followedUser) => this.repository.checkIfFollowsUser(followerUser, followedUser);
        this.updateActive = (id, active) => this.repository.updateActive(id, active);
        this.count = () => this.repository.count();
        this.repository = repository;
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = __decorate([
    (0, inversify_1.injectable)() // Esto hace que UserDomainService sea un servicio inyectable
    ,
    __param(0, (0, inversify_1.inject)(Types_1.Types.IUserRepository)),
    __metadata("design:paramtypes", [Object])
], UserDomainService);
