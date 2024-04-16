import express from "express";
import {myContainer} from "../../../../config/inversify.config";
import SupportMessageController from "../SupportMessageController";
import {Types} from "../../../../config/Types";
import {verifyToken} from "../../../../../middleware/AuthMiddleware";


export default function configureSupportMessageRoutes() {
    const router = express.Router();
    const supportMessageController = myContainer.get<SupportMessageController>(Types.SupportMessageController);

    router.post('', verifyToken, supportMessageController.saveSupportMessage);
    router.get('', verifyToken, supportMessageController.findSupportMessages);
    router.get('/user', verifyToken, supportMessageController.findUserSupportMessages);
    router.get('/:id', verifyToken, supportMessageController.findSupportMessageById);


    return router;
}