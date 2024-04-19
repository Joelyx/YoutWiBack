import express from "express";
import {myContainer} from "../../../../config/inversify.config";
import {Types} from "../../../../config/Types";
import {verifyAdminToken} from "../../../../../middleware/AuthMiddleware";
import SupportMessageV3Controller from "../SupportMessageV3Controller";


export default function configureSupportMessageRoutes() {
    const router = express.Router();
    const supportMessageController = myContainer.get<SupportMessageV3Controller>(Types.SupportMessageV3Controller);

    router.get('/me', verifyAdminToken, supportMessageController.findSupportMessages);


    return router;
}