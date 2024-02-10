import express from "express";
import {myContainer} from "../../../../config/inversify.config";
import ChannelController from "../ChannelController";
import {TYPES} from "../../../../config/types";
import {verifyToken} from "../../../../../middleware/AuthMiddleware";


export default function configureChannelRoutes() {
    const router = express.Router();
    const channelController = myContainer.get<ChannelController>(TYPES.ChannelController);

    router.post('', verifyToken, channelController.saveChannels);

    return router;
}