"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../../config/inversify.config");
const types_1 = require("../../../config/types");
const User_1 = require("../../../../domain/models/User");
class UserController {
    constructor() {
        this.userDomainService = inversify_config_1.myContainer.get(types_1.TYPES.IUserDomainService);
        /**
         * @openapi
         * /users:
         *   post:
         *     summary: Crea un nuevo usuario
         *     description: Crea un nuevo usuario en el sistema.
         *     requestBody:
         *       required: true
         *       content:
         *         middleware/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *                 description: Nombre de usuario
         *               password:
         *                 type: string
         *                 description: Contraseña del usuario
         *               role:
         *                 type: array
         *                 items:
         *                   type: string
         *                 description: Roles del usuario
         *               friends:
         *                 type: array
         *                 items:
         *                   type: string
         *                 description: Amigos del usuario
         *               email:
         *                 type: string
         *                 description: Email del usuario
         *     responses:
         *       201:
         *         description: Usuario creado exitosamente
         *       500:
         *         description: Error en el servidor
         */
        this.saveUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let date = new Date();
                let u = new User_1.User();
                u.setUsername = req.body.username;
                u.setPassword = req.body.password;
                u.setRole = req.body.role;
                u.setFriends = new Set(req.body.friends);
                u.setEmail = req.body.email;
                u.setCreatedAt = new Date();
                u.setUpdatedAt = new Date();
                const user = yield this.userDomainService.save(u);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        /**
         * @openapi
         * /users:
         *   get:
         *     summary: Obtiene todos los usuarios
         *     description: Devuelve una lista de todos los usuarios en el sistema.
         *     responses:
         *       200:
         *         description: Lista de usuarios
         *       500:
         *         description: Error en el servidor
         */
        this.findAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userDomainService.findAll();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        /**
         * @openapi
         * /users/{id}:
         *   get:
         *     summary: Obtiene un usuario por su ID
         *     description: Devuelve los detalles de un usuario específico por su ID.
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: El ID del usuario
         *     responses:
         *       200:
         *         description: Detalles del usuario
         *       500:
         *         description: Error en el servidor
         */
        this.findUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userDomainService.findById(Number(req.params.id));
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        /**
         * @openapi
         * /users/username/{username}:
         *   get:
         *     summary: Obtiene un usuario por su nombre de usuario
         *     description: Devuelve los detalles de un usuario específico por su nombre de usuario.
         *     parameters:
         *       - in: path
         *         name: username
         *         required: true
         *         schema:
         *           type: string
         *         description: El nombre de usuario del usuario
         *     responses:
         *       200:
         *         description: Detalles del usuario
         *       500:
         *         description: Error en el servidor
         */
        this.findUserByUsername = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userDomainService.findByUsername(req.params.username);
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = UserController;
