import express from "express";
import UserController from "../UserController";



const router = express.Router();

const controller = new UserController();

/*
router.get("/users", controller.findAllUsers);
router.post('/users', controller.saveUser);
router.get('/users/:id', controller.findUserById);
router.get('/users/username/:username', controller.findUserByUsername);
*/
export default router;