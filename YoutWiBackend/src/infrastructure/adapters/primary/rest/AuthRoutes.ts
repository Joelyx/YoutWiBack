// src/routes/authRoutes.ts
import express from 'express';
import {myContainer} from "../../../config/inversify.config";
import AuthController from "./AuthController";
import {TYPES} from "../../../config/types";
import passport from "passport";

export default function configureAuthRoutes() {
    const router = express.Router();
    const controller = myContainer.get<AuthController>(TYPES.AuthController);

    router.post('/register', (req, res) => controller.register(req, res));
    router.post('/login', (req, res) => controller.login(req, res));
    router.get('/confirm/:uid', (req, res) => controller.verifyAccount(req, res));
    router.post('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.post('/auth/google/callback',
        passport.authenticate('google'),
        controller.googleAuthCallback);


    return router;
}
