import {inject, injectable} from "inversify";
import {Types} from "../../../config/Types";
import {IPostDomainService} from "../../../../domain/port/primary/IPostDomainService";
import {Post} from "../../../../domain/models/Post";
import {Request, Response} from "express";
import {IUserDomainService} from "../../../../domain/port/primary/IUserDomainService";
import {IVideoDomainService} from "../../../../domain/port/primary/IVideoDomainService";
import {Comment} from "../../../../domain/models/Comment";
import {User} from "../../../../domain/models/User";



@injectable()
export default class PostController {

    constructor(
        @inject(Types.IPostDomainService) private postDomainService: IPostDomainService,
        @inject(Types.IUserDomainService) private userService: IUserDomainService,
        @inject(Types.IVideoDomainService) private videoService: IVideoDomainService
    ) {}

    public savePost = async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.user.email;
        const {videoId, content} = req.body;
        console.log(this.postDomainService);
        let user = await this.userService.findByEmail(userId);
        let video = await this.videoService.findById(videoId);
        let post = new Post();
        if(user != null && video != null){
            post.user = user;
            post.video = video;
            post.content = content;
            post.createdAt = new Date();
            post.likes = 0;
        }else {
            res.status(404).json({message: "User or video not found"});
        }

        await this.postDomainService.savePost(post);
        res.status(200).json({message: "Post saved successfully"});
    }

    public findPostsWithLimitAndOffset = async (req: Request, res: Response): Promise<void> => {
        const limit: number = parseInt(req.query.limit as string)?? 50;
        const offset: number = parseInt(req.query.offset as string) ?? 0;
        let posts = await this.postDomainService.findPostsWithLimitAndOffset(50, 0);

        if(posts){
            res.status(200).json(posts);
        }else{
            res.status(404).json({message: "Posts not found"});
        }
    }

    public findPostComments = async (req: Request, res: Response): Promise<void> => {
        const postId: string = req.params.postId;
        let comments = await this.postDomainService.findPostComments(postId);
        console.log(comments);
        if(comments){
            res.status(200).json(comments);
        }else{
            res.status(404).json({message: "Comments not found"});
        }
    }

    public savePostComment = async (req: Request, res: Response): Promise<void> => {
        const postId: string = req.params.postId;
        console.log(postId);
        const userId: string = req.user.userId;
        let comment: Comment = req.body.comment;
        let user = new User();
        user.setId = Number(userId);
        comment.user = user;
        console.log(comment);
        await this.postDomainService.savePostComment(postId, comment);
        res.status(200).json({message: "Comment saved successfully"});
    }

    public likePost = async (req: Request, res: Response): Promise<void> => {
        const postId: string = req.params.postId;
        const userId: string = req.user.userId;
        try {
            let number = await this.postDomainService.likePost(postId, userId);
            if (number != null) {
                if (number == 0) {
                    res.status(500).json({message: "Error al dar/quitar likes"});
                } else if (number == 1) {
                    res.status(200).json({message: "true"});

                } else {
                    res.status(200).json({message: "false"});
                }
            }else{
                res.status(500).json({message: "Error desconocido al dar/quitar likes"});
            }
        } catch (error) {
            console.error('Error procesando likePost', error);
            res.status(500).json({message: "Error interno del servidor"});
        }
    };


}