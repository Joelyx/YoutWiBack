import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import { User } from "../../domain/models/user";
import { Express } from "express";
import {myContainer} from "./inversify.config";
import {UserDomainService} from "../../domain/services/userDomainService";
import {TYPES} from "./types";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../../config/config";

const clientID = process.env.GOOGLE_CLIENT_ID ?? (() => { throw new Error("GOOGLE_CLIENT_ID no está definido"); })();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? (() => { throw new Error("GOOGLE_CLIENT_SECRET no está definido"); })();
const callbackURL = process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:3000/auth/google/callback";

passport.use(new GoogleStrategy({
        clientID,
        clientSecret,
        callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
        let userDomainService = myContainer.get<UserDomainService>(TYPES.IUserDomainService);

        let user: User = new User();
        user.setGoogleId = profile.id;
        user.setUid = uuidv4();
        user.setUsername = profile.displayName;
        console.log("user de google", user);
        try{
            user.setEmail = profile.emails ? profile.emails[0].value : '';
            const saved = await userDomainService.findByGoogleIdOrCreate(profile.id, user);
            // Generar token jwt
            let token = '';
            if(saved!=null){
                token = jwt.sign({ userId: saved.getId, username: saved.getUsername, role: saved.getRole }, JWT_SECRET, { expiresIn: '1h' });
            }
            done(null, {saved, token});
        }catch (e) {
            done(e instanceof Error ? e : new Error(String(e)), user);
        }
    }
));

passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});