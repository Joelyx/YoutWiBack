"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../../../../config/Types");
const inversify_config_1 = require("../../../../config/inversify.config");
const userService = inversify_config_1.myContainer.get(Types_1.Types.IUserDomainService);
const userResolvers = {
    Query: {
        getUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield userService.findById(id);
        }),
        getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield userService.findAll();
        }),
    },
    Mutation: {
        createUser: (_, user) => __awaiter(void 0, void 0, void 0, function* () {
            return yield userService.register(user);
        }),
        updateUser: (_, user) => __awaiter(void 0, void 0, void 0, function* () {
            return yield userService.save(user);
        }),
        deleteUser: (_2, _b) => __awaiter(void 0, [_2, _b], void 0, function* (_, { id }) {
            userService.deleteById(id);
            return id;
        }),
        updateUserActive: (_3, _c) => __awaiter(void 0, [_3, _c], void 0, function* (_, { id, active }) {
            return yield userService.updateActive(id, active);
        })
    },
};
exports.default = userResolvers;
