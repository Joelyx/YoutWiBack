import {IUserDomainService} from "../../domain/port/primary/IUserDomainService";

const Types = {
    IUserRepository: Symbol.for("IUserRepository"),
    IUserDomainService: Symbol.for("IUserDomainService"),
    AuthController: Symbol.for("AuthController"),
    IVideoRepository: Symbol.for("IVideoRepository"),
    IVideoDomainService: Symbol.for("VideoDomainService"),
    VideoController: Symbol.for("VideoController"),
    IChannelRepository: Symbol.for("IChannelRepository"),
    IChannelDomainService: Symbol.for("IChannelDomainService"),
    ChannelController: Symbol.for("ChannelController"),
    IBroadcasterRepository: Symbol.for("IBroadcasterRepository"),
    IBroadcasterDomainService: Symbol.for("IBroadcasterDomainService"),
    BroadcasterController: Symbol.for("BroadcasterController"),

};

export { Types };
