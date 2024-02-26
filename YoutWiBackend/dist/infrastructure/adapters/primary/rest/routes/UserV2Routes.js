"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
const inversify_config_1 = require("../../../../config/inversify.config");
const Types_1 = require("../../../../config/Types");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function configureUserV2Routes() {
    const router = express_1.default.Router();
    const userV2Controller = inversify_config_1.myContainer.get(Types_1.Types.UserV2Controller);
    // Configuración de multer para almacenar archivos en un directorio específico
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            const imagesDir = path_1.default.join(__dirname, '..', '..', '..', '..', '..', 'public', 'images');
            fs_1.default.mkdirSync(imagesDir, { recursive: true });
            cb(null, imagesDir);
        },
        filename: function (req, file, cb) {
            const extension = file.originalname.split('.').pop();
            const id = req.user.userId; // Asumiendo que el username está en el token
            cb(null, `${id}.${extension}`);
        }
    });
    const upload = (0, multer_1.default)({ storage: storage });
    router.post('/me/photo', AuthMiddleware_1.verifyToken, upload.single('photo'), userV2Controller.uploadUserImage);
    router.get('/me/photo', AuthMiddleware_1.verifyToken, userV2Controller.getUserOwnImage);
    router.put('/me/username', AuthMiddleware_1.verifyToken, userV2Controller.changeUsername);
    router.get('/:userId/photo', AuthMiddleware_1.verifyToken, userV2Controller.getUserImage);
    router.get('', AuthMiddleware_1.verifyToken, userV2Controller.findOtherUsers);
    router.post('/:userId/follow', AuthMiddleware_1.verifyToken, userV2Controller.followOrUnfollowUser);
    router.get('/:userId/follow', AuthMiddleware_1.verifyToken, userV2Controller.checkIfFollowsUser);
    router.get('/me', AuthMiddleware_1.verifyToken, userV2Controller.findMe);
    return router;
}
exports.default = configureUserV2Routes;
