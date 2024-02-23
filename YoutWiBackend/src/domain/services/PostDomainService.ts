import {IPostRepository} from "../port/secondary/IPostRepository";
import {Post} from "../models/Post";
import {Comment} from "../models/Comment";
import {inject, injectable} from "inversify";
import {IPostDomainService} from "../port/primary/IPostDomainService";
import {Types} from "../../infrastructure/config/Types";

@injectable()
export class PostDomainService implements IPostDomainService {
    constructor(@inject(Types.IPostRepository) private postRepository: IPostRepository) {
    }
    async savePost(post: Post): Promise<void> {
        await this.postRepository.savePost(post);
    }
    async findPost(postId: string): Promise<Post> {
        return await this.postRepository.findPost(postId);
    }
    async findPostComments(postId: string): Promise<Comment[]> {
        return await this.postRepository.findPostComments(postId);
    }
    async findPostsWithLimitAndOffset(limit: number, offset: number): Promise<Post[]> {
        return await this.postRepository.findPostsWithLimitAndOffset(limit, offset);
    }
    async savePostComment(postId: string, comment: Comment): Promise<void> {
        await this.postRepository.savePostComment(postId, comment);
    }

    async likePost(postId: string, userId: string): Promise<Number> {
        return await this.postRepository.likePost(postId, userId);
    }
}