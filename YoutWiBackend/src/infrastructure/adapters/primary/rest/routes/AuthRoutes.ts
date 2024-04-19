import express from 'express';
import {myContainer} from "../../../../config/inversify.config";
import AuthController from "../AuthController";
import {Types} from "../../../../config/Types";
import passport from "passport";

export default function configureAuthRoutes() {
    const router = express.Router();
    const controller = myContainer.get<AuthController>(Types.AuthController);

    router.post('/register', (req, res) => controller.register(req, res));
    router.post('/login', (req, res) => controller.login(req, res));
    router.get('/confirm/:uid', (req, res) => controller.verifyAccount(req, res));
    router.post('/login/admin', (req, res) => controller.adminLogin(req, res));


    router.get('/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            // Redirige al usuario o maneja la sesión como necesites
            res.redirect('/');
        }
    );

    router.post('/google', async (req, res) => controller.googleAuth(req, res));
    router.get('/twitch/callback', async (req, res) => controller.twitchAuth(req, res));


    return router;
}
