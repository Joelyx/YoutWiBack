"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserEntity_1 = require("../../entity/UserEntity");
const DataSource_1 = require("../../config/DataSource");
const typeorm_1 = require("typeorm");
class UserEntityRepository {
    constructor() {
        this.userRepository = DataSource_1.AppDataSource.getRepository(UserEntity_1.UserEntity);
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.save(user);
        });
    }
    deleteById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.delete(userId);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { id: userId } });
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { username } });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { email } });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.find();
        });
    }
    findByUid(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { uid } });
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { googleId } });
        });
    }
    findStartsWithUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.find({
                where: {
                    username: (0, typeorm_1.Like)(`%${username}%`)
                }
            });
        });
    }
    updateActive(id, active) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(id);
            if (user) {
                user.active = active;
                return this.save(user);
            }
            return null;
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.count();
        });
    }
}
exports.default = new UserEntityRepository();
