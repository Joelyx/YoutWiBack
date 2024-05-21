import { Container } from 'inversify';
import { Types } from './Types';
import {IUserRepository} from "../../domain/port/secondary/IUserRepository";
import {UserDomainService} from "../../domain/services/UserDomainService";
import {UserDatabaseService} from "../adapters/secondary/services/UserDatabaseService";
import AuthController from "../adapters/primary/rest/AuthController";
import {IVideoRepository} from "../../domain/port/secondary/IVideoRepository";
import {VideoDatabaseService} from "../adapters/secondary/services/VideoDatabaseService";
import {IVideoDomainService} from "../../domain/port/primary/IVideoDomainService";
import {VideoDomainService} from "../../domain/services/VideoDomainService";
import VideoController from "../adapters/primary/rest/VideoController";
import {IChannelRepository} from "../../domain/port/secondary/IChannelRepository";
import {ChannelDatabaseService} from "../adapters/secondary/services/ChannelDatabaseService";
import {IChannelDomainService} from "../../domain/port/primary/IChannelDomainService";
import {ChannelDomainService} from "../../domain/services/ChannelDomainService";
import ChannelController from "../adapters/primary/rest/ChannelController";
import {IBroadcasterRepository} from "../../domain/port/secondary/IBroadcasterRepository";
import {BroadcasterDatabaseService} from "../adapters/secondary/services/BroadcasterDatabaseService";
import {IBroadcasterDomainService} from "../../domain/port/primary/IBroadcasterDomainService";
import {BroadcasterDomainService} from "../../domain/services/BroadcasterDomainService";
import BroadcasterController from "../adapters/primary/rest/BroadcasterController";
import {PostDatabaseService} from "../adapters/secondary/services/PostDatabaseService";
import {IPostRepository} from "../../domain/port/secondary/IPostRepository";
import {PostDomainService} from "../../domain/services/PostDomainService";
import {IPostDomainService} from "../../domain/port/primary/IPostDomainService";
import PostController from "../adapters/primary/rest/PostController";
import UserV2Controller from "../adapters/primary/rest/UserV2Controller";
import {SupportMessageDatabaseService} from "../adapters/secondary/services/SupportMessageDatabaseService";
import {ISupportMessageRepository} from "../../domain/port/secondary/ISupportMessageRepository";
import SupportMessageController from "../adapters/primary/rest/SupportMessageController";
import {ISupportMessageDomainService} from "../../domain/port/primary/ISupportMessageDomainService";
import SupportMessageV3Controller from "../adapters/primary/rest/SupportMessageV3Controller";


const myContainer = new Container();
// Aquí registrarás tus dependencias
myContainer.bind<IUserRepository>(Types.IUserRepository).to(UserDatabaseService);
myContainer.bind<UserDomainService>(Types.IUserDomainService).to(UserDomainService);
myContainer.bind<AuthController>(Types.AuthController).to(AuthController);
myContainer.bind<IVideoRepository>(Types.IVideoRepository).to(VideoDatabaseService);
myContainer.bind<IVideoDomainService>(Types.IVideoDomainService).to(VideoDomainService);
myContainer.bind<VideoController>(Types.VideoController).to(VideoController);
myContainer.bind<IChannelRepository>(Types.IChannelRepository).to(ChannelDatabaseService);
myContainer.bind<IChannelDomainService>(Types.IChannelDomainService).to(ChannelDomainService);
myContainer.bind<ChannelController>(Types.ChannelController).to(ChannelController);
myContainer.bind<IBroadcasterRepository>(Types.IBroadcasterRepository).to(BroadcasterDatabaseService);
myContainer.bind<IBroadcasterDomainService>(Types.IBroadcasterDomainService).to(BroadcasterDomainService);
myContainer.bind<BroadcasterController>(Types.BroadcasterController).to(BroadcasterController);
myContainer.bind<IPostRepository>(Types.IPostRepository).to(PostDatabaseService);
myContainer.bind<IPostDomainService>(Types.IPostDomainService).to(PostDomainService);
myContainer.bind<PostController>(Types.PostController).to(PostController);
myContainer.bind<UserV2Controller>(Types.UserV2Controller).to(UserV2Controller);
myContainer.bind<ISupportMessageRepository>(Types.ISupportMessageRepository).to(SupportMessageDatabaseService);
myContainer.bind<SupportMessageController>(Types.SupportMessageController).to(SupportMessageController);
myContainer.bind<ISupportMessageDomainService>(Types.ISupportMessageDomainService).to(SupportMessageDatabaseService);
myContainer.bind<SupportMessageV3Controller>(Types.SupportMessageV3Controller).to(SupportMessageV3Controller);





export { myContainer };
