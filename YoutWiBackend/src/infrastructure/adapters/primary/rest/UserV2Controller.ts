import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IUserDomainService } from "../../../../domain/port/primary/IUserDomainService";
import { Types } from "../../../config/Types";
import { User } from "../../../../domain/models/User";
import path from "node:path";
import fs from "fs";

@injectable()
export default class UserV2Controller {
    constructor(
        @inject(Types.IUserDomainService) private userService: IUserDomainService
    ) {}

    public uploadUserImage = async (req: Request, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        res.status(200).json({ message: "Image uploaded successfully", path: req.file.path });
    };

    public getUserOwnImage = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.userId;

        const imageName = `${userId}.jpg`;
        const imagePath = path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', imageName);

        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            const defaultImagePath = path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', 'default.png');
            res.sendFile(defaultImagePath);
        }
    };

    public changeUsername = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.id;
        const { newUsername } = req.body;

        const user = await this.userService.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const usernameExists = await this.userService.findByUsername(newUsername);

        if (usernameExists) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }

        user.setUsername = newUsername;

        try {
            await this.userService.save(user);
            res.status(200).json({ message: "Username updated successfully" });
        } catch (error: any) {
            res.status(500).json({ message: "Could not update username", error: error.toString() });
        }
    }


    public getUserImage = async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.params.userId;

        const imageName = `${userId}.jpg`;
        const imagePath = path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', imageName);

        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.status(404).send("Image not found.");
        }
    };

    public findOtherUsers = async (req: Request, res: Response): Promise<void> => {
        const { startswith } = req.query;
        const reqUserId = req.user.userId;

        try {
            const reqUser = await this.userService.findById(reqUserId);
            if (!reqUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const users = await this.userService.findStartsWithUsername(startswith as string);
            const usersDtoPromise = users.map(async (user) => {
                const isFollowing = await this.userService.checkIfFollowsUser(reqUser, user);
                return {
                    id: user.getId,
                    username: user.getUsername,
                    isFollowing
                };
            });

            const usersDto = await Promise.all(usersDtoPromise);

            res.status(200).json(usersDto);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    public followOrUnfollowUser = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.userId;
        const userIdToFollow = req.params.userId;
        console.log("tryToFollowOrUnfollowUser", userId, userIdToFollow)

        const user = await this.userService.findById(userId);
        const userToFollow = await this.userService.findById(Number(userIdToFollow));

        if (!user || !userToFollow) {
            res.status(404).json({ message: "User not found" });
            return;
        }else if (user.getId === userToFollow.getId) {
            res.status(400).json({ message: "You cannot follow yourself" });
            return;
        }

        try {
            await this.userService.followOrUnfollowUser(user, userToFollow);
            res.status(200).json({ message: "User followed successfully" });
        } catch (error: any) {
            res.status(500).json({ message: "Could not follow user", error: error.toString() });
        }

    }

    public checkIfFollowsUser = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.userId;
        const userIdToCheck = req.params.userId;

        const user = await this.userService.findById(userId);
        const userToCheck = await this.userService.findById(Number(userIdToCheck));

        if (!user || !userToCheck) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const follows = await this.userService.checkIfFollowsUser(user, userToCheck);

        res.status(200).json({ follows });

    }

    public findFollowingUsers = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.userId;
        const user = await this.userService.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const followingUsers = await this.userService.findFollowingUsers(user);

        const followingUsersDto = followingUsers.map((user) => {
            return {
                id: user.getId,
                username: user.getUsername,
                isFollowing: true
            };
        });

        res.status(200).json(followingUsersDto);
    }

    public findUserById = async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.userId;
        const user = await this.userService.findById(Number(userId));

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            id: user.getId,
            username: user.getUsername
        });
    }

    public findFollowers = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.userId;
        const user = await this.userService.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const followers = await this.userService.findFollowers(user);
        const followedUsers = await this.userService.findFollowingUsers(user);


        const followersDto = followers.map((user) => {
            return {
                id: user.getId,
                username: user.getUsername,
                isFollowing: followedUsers.some(followedUser => followedUser.getId === user.getId)
            };
        });

        res.status(200).json(followersDto);
    }

    public findMe = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user.userId;
        const user = await this.userService.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            id: user.getId,
            username: user.getUsername
        });

    }
}


interface UserDto {
    id: number;
    username: string;
    isFollowing: boolean;
}