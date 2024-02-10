import { Container } from 'inversify';
import { TYPES } from './types';
import {IUserRepository} from "../../domain/port/secondary/IUserRepository";
import {UserDomainService} from "../../domain/services/UserDomainService";
import {UserDatabaseService} from "../services/userDatabaseService";
import AuthController from "../adapters/primary/rest/AuthController";
import {IVideoRepository} from "../../domain/port/secondary/IVideoRepository";
import {VideoDatabaseService} from "../services/VideoDatabaseService";
import {IVideoDomainService} from "../../domain/port/primary/IVideoDomainService";
import {VideoDomainService} from "../../domain/services/VideoDomainService";
import VideoController from "../adapters/primary/rest/VideoController";
import {IChannelRepository} from "../../domain/port/secondary/IChannelRepository";
import {ChannelDatabaseService} from "../services/ChannelDatabaseService";
import {IChannelDomainService} from "../../domain/port/primary/IChannelDomainService";
import {ChannelDomainService} from "../../domain/services/ChannelDomainService";
import ChannelController from "../adapters/primary/rest/ChannelController";

const myContainer = new Container();
// Aquí registrarás tus dependencias
myContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserDatabaseService);
myContainer.bind<UserDomainService>(TYPES.IUserDomainService).to(UserDomainService);
myContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
myContainer.bind<IVideoRepository>(TYPES.IVideoRepository).to(VideoDatabaseService);
myContainer.bind<IVideoDomainService>(TYPES.IVideoDomainService).to(VideoDomainService);
myContainer.bind<VideoController>(TYPES.VideoController).to(VideoController);
myContainer.bind<IChannelRepository>(TYPES.IChannelRepository).to(ChannelDatabaseService);
myContainer.bind<IChannelDomainService>(TYPES.IChannelDomainService).to(ChannelDomainService);
myContainer.bind<ChannelController>(TYPES.ChannelController).to(ChannelController);






export { myContainer };
