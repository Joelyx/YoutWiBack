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
let SupportMessageController = class SupportMessageController {
    constructor(supportMessageDomainService, userService) {
        this.supportMessageDomainService = supportMessageDomainService;
        this.userService = userService;
        /*public saveSupportMessage = async (req: Request, res: Response): Promise<void> => {
            const userId: string = req.user.email;
            const {message} = req.body;
            let user = await this.userService.findByEmail(userId);
            let supportMessage = new SupportMessage();
            if(user != null){
                supportMessage.user = new User();
                supportMessage.user.setId = user.getId;
                supportMessage.message = message;
                supportMessage.createdAt = new Date();
                supportMessage.isFromSupport = false;
            }else {
                res.status(404).json({message: "User not found"});
            }
    
            await this.supportMessageDomainService.save(supportMessage);
            res.status(200).json({message: "Support message saved successfully"});
        }*/
        /*public findSupportMessages = async (req: Request, res: Response): Promise<void> => {
            let supportMessages = await this.supportMessageDomainService.findAllSupportMessages();
            if(supportMessages){
                res.status(200).json(supportMessages);
            }else{
                res.status(404).json({message: "Support messages not found"});
            }
        }*/
        this.findUserSupportMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.email;
            let user = yield this.userService.findByEmail(userId);
            if (user) {
                let userSupportMessages = yield this.supportMessageDomainService.findAllUserMessages(user.getId);
                if (userSupportMessages) {
                    res.status(200).json(userSupportMessages);
                }
                else {
                    res.status(404).json({ message: "User support messages not found" });
                }
            }
            else {
                res.status(404).json({ message: "User not found" });
            }
        });
    }
};
SupportMessageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.ISupportMessageDomainService)),
    __param(1, (0, inversify_1.inject)(Types_1.Types.IUserDomainService)),
    __metadata("design:paramtypes", [Object, Object])
], SupportMessageController);
exports.default = SupportMessageController;
