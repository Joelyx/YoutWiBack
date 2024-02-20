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






export { myContainer };
