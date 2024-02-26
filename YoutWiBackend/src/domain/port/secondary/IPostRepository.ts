import {Post} from "../../models/Post";
import {Comment} from "../../models/Comment";


export interface IPostRepository {
    savePost(post: Post): Promise<void>;
    findPost(postId: string): Promise<Post>;
    findPostComments(postId: string): Promise<Comment[]>;
    findPostsWithLimitAndOffset(limit: number, offset: number): Promise<Post[]>;
    savePostComment(postId: string, comment: Comment): Promise<void>;
    likePost(postId: string, userId: string): Promise<Number>;
    findUserPosts(userId: string): Promise<Post[]>;
}