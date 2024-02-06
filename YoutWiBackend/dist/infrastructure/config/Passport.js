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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const inversify_config_1 = require("./inversify.config");
const types_1 = require("./types");
const user_1 = require("../../domain/models/user");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const clientID = (_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : (() => { throw new Error("GOOGLE_CLIENT_ID no está definido"); })();
const clientSecret = (_b = process.env.GOOGLE_CLIENT_SECRET) !== null && _b !== void 0 ? _b : (() => { throw new Error("GOOGLE_CLIENT_SECRET no está definido"); })();
const callbackURL = (_c = process.env.GOOGLE_CALLBACK_URL) !== null && _c !== void 0 ? _c : "http://localhost:3000/api/auth/google/callback";
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID,
    clientSecret,
    callbackURL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const userDomainService = inversify_config_1.myContainer.get(types_1.TYPES.IUserDomainService);
    console.log("conexion exitosa con google");
    let user = new user_1.User();
    user.setGoogleId = profile.id;
    user.setUid = (0, uuid_1.v4)();
    user.setUsername = profile.displayName;
    user.setRole = "ROLE_USER";
    user.setPassword = (0, uuid_1.v4)();
    let newVar = yield userDomainService.findByGoogleIdOrCreate(profile.id, user);
    if (newVar) {
        const token = jsonwebtoken_1.default.sign({
            userId: user.getId,
            username: user.getUsername,
            role: user.getRole
        }, config_1.JWT_SECRET, { expiresIn: '1h' });
        done(null, user, token);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
