import {IUserDomainService} from "../../domain/port/IUserDomainService";

const TYPES = {
    IUserRepository: Symbol.for("IUserRepository"),
    IUserDomainService: Symbol.for("IUserDomainService"),
    AuthController: Symbol.for("AuthController")

};

export { TYPES };
