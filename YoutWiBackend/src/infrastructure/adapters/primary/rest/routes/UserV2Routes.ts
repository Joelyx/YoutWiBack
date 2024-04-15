import express from 'express';
import { verifyToken } from "../../../../../middleware/AuthMiddleware";
import { myContainer } from "../../../../config/inversify.config";
import { Types } from "../../../../config/Types";
import UserV2Controller from "../UserV2Controller";
import multer from "multer";
import path from "path";
import fs from "fs";

export default function configureUserV2Routes() {
    const router = express.Router();
    const userV2Controller = myContainer.get<UserV2Controller>(Types.UserV2Controller);

    // Configuración de multer para almacenar archivos en un directorio específico
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const imagesDir = path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'images');
            fs.mkdirSync(imagesDir, { recursive: true });
            cb(null, imagesDir);
        },
        filename: function (req, file, cb) {
            const extension = file.originalname.split('.').pop();
            const id = req.user.userId; // Asumiendo que el username está en el token
            cb(null, `${id}.${extension}`);
        }
    });

    const upload = multer({ storage: storage });

    router.post('/me/photo', verifyToken, upload.single('photo'), userV2Controller.uploadUserImage);
    router.get('/me/photo', verifyToken, userV2Controller.getUserOwnImage);
    router.put('/me/username', verifyToken, userV2Controller.changeUsername);
    router.get('/:userId/photo', verifyToken, userV2Controller.getUserImage);
    router.get('', verifyToken, userV2Controller.findOtherUsers);
    router.post('/:userId/follow', verifyToken, userV2Controller.followOrUnfollowUser);
    router.get('/:userId/follow', verifyToken, userV2Controller.checkIfFollowsUser);
    router.get('/me/following', verifyToken, userV2Controller.findFollowingUsers);
    router.get('/me/followers', verifyToken, userV2Controller.findFollowers);
    router.get('/me', verifyToken, userV2Controller.findMe);

    return router;
}
