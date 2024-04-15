import {IUserDomainService} from "../../../../domain/port/primary/IUserDomainService";
import {Types} from "../../../config/Types";
import {myContainer} from "../../../config/inversify.config";
import {User} from "../../../../domain/models/User";

const userService = myContainer.get<IUserDomainService>(Types.IUserDomainService);

export const resolvers = {
    Query: {
        getUser: async (_: any, { id }: { id: number }) => {
            return await userService.findById(id);
        },
        getAllUsers: async () => {
            return await userService.findAll();
        },
    },
    Mutation: {
        createUser: async (_: any, user: User) => {
            return await userService.register(user);
        },
        updateUser: async (_: any, user: User) => {
            return await userService.save(user);
        },
        deleteUser: async (_: any, { id }: { id: number }) => {
            await userService.deleteById(id);
            return id;
        },
    },
};