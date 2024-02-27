


export interface ICommentRepository {
    saveComments(comments: Comment[]): Promise<void>;
}