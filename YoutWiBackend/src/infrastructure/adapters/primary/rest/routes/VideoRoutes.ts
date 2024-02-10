import express from 'express';
import {verifyToken} from "../../../../../middleware/AuthMiddleware";
import {myContainer} from "../../../../config/inversify.config";
import {VideoDomainService} from "../../../../../domain/services/VideoDomainService";
import {TYPES} from "../../../../config/types";
import VideoController from "../VideoController";

export default function configureVideoRoutes() {
    const router = express.Router();
    const videosController = myContainer.get<VideoController>(TYPES.VideoController);

    router.post('/liked', verifyToken, videosController.saveLikedUserVideos);



    return router;
}


