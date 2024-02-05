import express from "express";
import UserController from "../../application/userController";
const router = express.Router();
const controller = new UserController();
router.get("/usuarios", controller.findAllUsers);
//router.get("/usuarios/:id", controller.findUserById);
router.post('/users', controller.saveUser);
//router.get('/usuarios/portfolio/:id', controller.getAllPortfolioDataByUserId);
export default router;
