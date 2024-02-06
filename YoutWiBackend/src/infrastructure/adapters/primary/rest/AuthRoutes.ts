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


    return router;
}
