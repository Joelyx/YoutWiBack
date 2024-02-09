import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { myContainer } from './inversify.config';
import { TYPES } from './types';
import {User} from "../../domain/models/User";
import { v4 as uuidv4 } from 'uuid';
import {IUserDomainService} from "../../domain/port/IUserDomainService";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../../config/config";

const clientID = process.env.GOOGLE_CLIENT_ID ?? (() => { throw new Error("GOOGLE_CLIENT_ID no está definido"); })();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? (() => { throw new Error("GOOGLE_CLIENT_SECRET no está definido"); })();
const callbackURL = process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:3000/api/auth/google/callback";

passport.use(new GoogleStrategy({
        clientID,
        clientSecret,
        callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
        const userDomainService = myContainer.get<IUserDomainService>(TYPES.IUserDomainService);

        console.log("conexion exitosa con google");

        let user: User = new User();
        user.setGoogleId = profile.id;
        user.setUid = uuidv4();
        user.setUsername = profile.displayName;
        user.setRole = "ROLE_USER";
        user.setPassword = uuidv4();
        let newVar = await userDomainService.findByGoogleIdOrCreate(profile.id, user);
        if(newVar){
            const token = jwt.sign({
                userId: user.getId,
                username: user.getUsername,
                role: user.getRole
            }, JWT_SECRET, { expiresIn: '1h' });


            done(null, user, token);
        }

    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});
