import { IResolvers } from '@graphql-tools/utils';
import { VideoDomainService } from "../../../../../domain/services/VideoDomainService";
import { Video } from "../../../../../domain/models/Video";

interface ContextType {
    videoDomainService: VideoDomainService;
}

export const videoResolvers: IResolvers<any, ContextType> = {
    Query: {
        getAllVideos: async (_: any, { limit = 10, offset = 0 }: { limit?: number; offset?: number }, { videoDomainService }) => {
            return videoDomainService.findAllVideos();
        },
        getVideo: async (_: any, { id }: { id: string }, { videoDomainService }) => {
            return videoDomainService.findById(id);
        },
    },
    Mutation: {
        createVideo: async (_: any, { title, id }: { title: string; id: string }, { videoDomainService }) => {
            const newVideo = new Video();
            newVideo.title = title;
            newVideo.id = id;
            newVideo.createdAt = new Date();
            const videos: Video[] = [newVideo]
            return videoDomainService.saveVideos(videos);
        },
    },
};
