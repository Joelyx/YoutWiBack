import { Container } from 'inversify';
import { TYPES } from './types';
import {IUserRepository} from "../../domain/port/iUserRepository";
import {UserDomainService} from "../../domain/services/userDomainService";
import {UserEntityService} from "../services/userEntityService";
import AuthController from "../adapters/primary/rest/AuthController";

const myContainer = new Container();
// Aquí registrarás tus dependencias
myContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserEntityService);
myContainer.bind<UserDomainService>(TYPES.IUserDomainService).to(UserDomainService);
myContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);


export { myContainer };
