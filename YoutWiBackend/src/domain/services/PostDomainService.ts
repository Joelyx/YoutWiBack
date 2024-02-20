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
        throw new Error("Method not implemented.");
    }
    async findPostComments(postId: string): Promise<Comment[]> {
        throw new Error("Method not implemented.");
    }
    async findPostsWithLimitAndOffset(limit: number, offset: number): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
}