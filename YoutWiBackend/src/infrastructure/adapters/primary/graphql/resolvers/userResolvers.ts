import {IUserDomainService} from "../../../../../domain/port/primary/IUserDomainService";
import {Types} from "../../../../config/Types";
import {myContainer} from "../../../../config/inversify.config";
import {User} from "../../../../../domain/models/User";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";

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
            user.setRole = role;
            user.setPassword = await bcrypt.hash(password, 10);
            user.setUid = uuidv4();
            user.setActive = true;
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