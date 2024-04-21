import {IUserDomainService} from "../../../../../domain/port/primary/IUserDomainService";
import {Types} from "../../../../config/Types";
import {myContainer} from "../../../../config/inversify.config";
import {User} from "../../../../../domain/models/User";
import postResolvers from "./postResolvers";

const userService = myContainer.get<IUserDomainService>(Types.IUserDomainService);

const userResolvers = {
    Query: {
        getUser: async (_: any, { id }: { id: number }) => {
            return await userService.findById(id);
        },
        getAllUsers: async () => {
            return await userService.findAll();
        },
        getUserCount: async () => {
            return await userService.count();
        },
    },
    Mutation: {
        createUser: async (_: any, { username, email, password, role }: { username: string, email: string, password: string, role: string }) => {
            const user = new User();
            user.setUsername = username;
            user.setEmail = email;
            user.setPassword = password;
            user.setRole = role;
            return await userService.register(user);
        },
        updateUser: async (_: any, user: User) => {
            return await userService.save(user);
        },
        deleteUser: async (_: any, { id }: { id: number }) => {
            userService.deleteById(id);
            return id;
        },
        updateUserActive: async (_: any, { id, active }: { id: number, active: boolean }) => {
            return await userService.updateActive(id, active);
        }
    },
};

export default userResolvers;