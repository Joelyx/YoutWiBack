import {inject, injectable} from "inversify";
import {Types} from "../../../config/Types";
import {Request, Response} from "express";
import {IUserDomainService} from "../../../../domain/port/primary/IUserDomainService";
import {SupportMessageEntity} from "../../../entity/SupportMessageEntity";
import {ISupportMessageDomainService} from "../../../../domain/port/primary/ISupportMessageDomainService";
import {SupportMessage} from "../../../../domain/models/SupportMessage";
import {User} from "../../../../domain/models/User";

@injectable()
export default class SupportMessageController {

    constructor(
        @inject(Types.ISupportMessageDomainService) private supportMessageDomainService: ISupportMessageDomainService,
        @inject(Types.IUserDomainService) private userService: IUserDomainService
    ) {}

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

    public findUserSupportMessages = async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.user.email;
        let user = await this.userService.findByEmail(userId);
        if(user){
            let userSupportMessages = await this.supportMessageDomainService.findAllUserMessages(user.getId);
            if(userSupportMessages){
                res.status(200).json(userSupportMessages);
            }else{
                res.status(404).json({message: "User support messages not found"});
            }
        }else{
            res.status(404).json({message: "User not found"});
        }
    }

    /*public findSupportMessageById = async (req: Request, res: Response): Promise<void> => {
        const messageId: string = req.params.messageId;
        let supportMessage = await this.supportMessageDomainService.findById(parseInt(messageId));
        if(supportMessage){
            res.status(200).json(supportMessage);
        }else{
            res.status(404).json({message: "Support message not found"});
        }
    }*/

}