import {IUserDomainService} from "../../domain/port/primary/IUserDomainService";

const TYPES = {
    IUserRepository: Symbol.for("IUserRepository"),
    IUserDomainService: Symbol.for("IUserDomainService"),
    AuthController: Symbol.for("AuthController"),
    IVideoRepository: Symbol.for("IVideoRepository"),
    IVideoDomainService: Symbol.for("VideoDomainService"),

};

export { TYPES };
