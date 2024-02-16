import {verifyToken} from "../../../../../middleware/AuthMiddleware";
import {myContainer} from "../../../../config/inversify.config";
import express from "express";
import {Types} from "../../../../config/Types";
import BroadcasterController from "../BroadcasterController";


export default function configureBroadcasterRoutes() {
    const router = express.Router();
    const broadcasterController = myContainer.get<BroadcasterController>(Types.BroadcasterController);

    router.post('/followed', verifyToken, broadcasterController.saveFollowed);
    router.post('', verifyToken, broadcasterController.saveBroadcasters);
    router.get('/me', verifyToken, broadcasterController.findUserFollowedBroadcasters);

    return router;
}