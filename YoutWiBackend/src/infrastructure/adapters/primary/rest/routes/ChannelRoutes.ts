import express from "express";
import {myContainer} from "../../../../config/inversify.config";
import ChannelController from "../ChannelController";
import {Types} from "../../../../config/Types";
import {verifyToken} from "../../../../../middleware/AuthMiddleware";


export default function configureChannelRoutes() {
    const router = express.Router();
    const channelController = myContainer.get<ChannelController>(Types.ChannelController);

    router.post('', verifyToken, channelController.saveChannels);
    router.post('/subscribed', verifyToken, channelController.saveSubscribed);

    return router;
}