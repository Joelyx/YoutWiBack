import {inject, injectable} from "inversify";
import {Types} from "../../../config/Types";
import {Request, Response} from "express";
import {IUserDomainService} from "../../../../domain/port/primary/IUserDomainService";
import {SupportMessageEntity} from "../../../entity/SupportMessageEntity";
import {ISupportMessageDomainService} from "../../../../domain/port/primary/ISupportMessageDomainService";
import {SupportMessage} from "../../../../domain/models/SupportMessage";
import {User} from "../../../../domain/models/User";

@injectable()
export default class SupportMessageV3Controller {

    constructor(
        @inject(Types.ISupportMessageDomainService) private supportMessageDomainService: ISupportMessageDomainService,
        @inject(Types.IUserDomainService) private userService: IUserDomainService
    ) {}

    public findSupportMessages = async (req: Request, res: Response): Promise<void> => {
        let supportMessages = await this.supportMessageDomainService.findAllSupportMessages();
        if(supportMessages){
            res.status(200).json(supportMessages);
        }else{
            res.status(404).json({message: "Support messages not found"});
        }
    }

}