import express, { Request, Response } from 'express';
import { myContainer } from "../../../config/inversify.config";
import { Types } from "../../../config/Types";
import { UserDomainService } from "../../../../domain/services/UserDomainService";
import { User } from "../../../../domain/models/User";

class UserController {
    private userDomainService = myContainer.get<UserDomainService>(Types.IUserDomainService);

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

    public findAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userDomainService.findAll();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public findUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userDomainService.findById(Number(req.params.id));
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

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
