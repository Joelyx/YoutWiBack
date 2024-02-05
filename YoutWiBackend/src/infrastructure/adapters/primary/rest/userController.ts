import express, { Request, Response } from 'express';
import { myContainer } from "../../../config/inversify.config";
import { TYPES } from "../../../config/types";
import { UserDomainService } from "../../../../domain/services/userDomainService";
import { User } from "../../../../domain/models/user";

class UserController {
    private userDomainService = myContainer.get<UserDomainService>(TYPES.IUserDomainService);

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
    public saveUser = async (req: Request, res: Response): Promise<void> => {
        try {
            let date: Date = new Date();
            let u = new User();
            u.setUsername = req.body.username;
            u.setPassword = req.body.password;
            u.setRole = req.body.role;
            u.setFriends = new Set(req.body.friends);
            u.setEmail = req.body.email;
            u.setCreatedAt = new Date();
            u.setUpdatedAt = new Date();
            const user = await this.userDomainService.save(u);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

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
    public findAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userDomainService.findAll();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

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
    public findUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userDomainService.findById(Number(req.params.id));
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

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
    public findUserByUsername = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await this.userDomainService.findByUsername(req.params.username);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

}

export default UserController;
