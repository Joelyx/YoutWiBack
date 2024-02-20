"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
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
    IPostRepository: Symbol.for("IPostRepository"),
    IPostDomainService: Symbol.for("IPostDomainService"),
    PostController: Symbol.for("PostController"),
};
exports.Types = Types;
