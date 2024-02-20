import {inject, injectable} from "inversify";
import {IPostDomainService} from "../../../../domain/port/primary/IPostDomainService";
import {Post} from "../../../../domain/models/Post";
import {Request, Response} from "express";
import {Types} from "../../../config/Types";
import {IUserDomainService} from "../../../../domain/port/primary/IUserDomainService";
import {IVideoDomainService} from "../../../../domain/port/primary/IVideoDomainService";



@injectable()
class PostController{
    constructor(
        @inject(Types.IPostDomainService) private service: IPostDomainService,
        //@inject(Types.IUserDomainService) private userService: IUserDomainService,
        //@inject(Types.IVideoDomainService) private videoService: IVideoDomainService
    ){
    }

    /**
     * Recibe la id del video y el contenido del post
     * @param req
     * @param res
     */
    async savePost(req: Request, res: Response): Promise<void> {
        const userId: string = req.user.email;
        console.log(this.service);
        const {videoId, content} = req.body;
        /*let user = await this.userService.findByEmail(userId);
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

        await this.service.savePost(post);*/
        res.status(200).json({message: "Post saved successfully"});

    }

    async findPost(req: Request, res: Response): Promise<void> {
        const postId: string = req.params.postId;
        let post = await this.service.findPost(postId);

        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: "Post not found"});
        }
    }

    async findPostComments(req: Request, res: Response): Promise<void> {
        const postId: string = req.params.postId;
        let comments = await this.service.findPostComments(postId);

        if(comments){
            res.status(200).json(comments);
        }else{
            res.status(404).json({message: "Comments not found"});
        }
    }

    async findPostsWithLimitAndOffset(req: Request, res: Response): Promise<void> {
        const limit: number = parseInt(req.query.limit as string);
        const offset: number = parseInt(req.query.offset as string);
        let posts = await this.service.findPostsWithLimitAndOffset(limit, offset);

        if(posts){
            res.status(200).json(posts);
        }else{
            res.status(404).json({message: "Posts not found"});
        }
    }

}

export default PostController;