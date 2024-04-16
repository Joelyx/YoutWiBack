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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportMessageEntity = void 0;
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("./UserEntity");
let SupportMessageEntity = class SupportMessageEntity {
};
exports.SupportMessageEntity = SupportMessageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], SupportMessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], SupportMessageEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SupportMessageEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SupportMessageEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], SupportMessageEntity.prototype, "isFromSupport", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.supportMessages),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", UserEntity_1.UserEntity)
], SupportMessageEntity.prototype, "user", void 0);
exports.SupportMessageEntity = SupportMessageEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'support_messages' })
], SupportMessageEntity);
