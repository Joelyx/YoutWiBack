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
const inversify_1 = require("inversify");
const Types_1 = require("../../../config/Types");
let SupportMessageV3Controller = class SupportMessageV3Controller {
    constructor(supportMessageDomainService, userService) {
        this.supportMessageDomainService = supportMessageDomainService;
        this.userService = userService;
        this.findSupportMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let supportMessages = yield this.supportMessageDomainService.findAllSupportMessages();
            if (supportMessages) {
                res.status(200).json(supportMessages);
            }
            else {
                res.status(404).json({ message: "Support messages not found" });
            }
        });
    }
};
SupportMessageV3Controller = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.ISupportMessageDomainService)),
    __param(1, (0, inversify_1.inject)(Types_1.Types.IUserDomainService)),
    __metadata("design:paramtypes", [Object, Object])
], SupportMessageV3Controller);
exports.default = SupportMessageV3Controller;
