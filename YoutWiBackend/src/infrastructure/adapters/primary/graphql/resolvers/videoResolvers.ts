import { IResolvers } from '@graphql-tools/utils';
import { VideoDomainService } from "../../../../../domain/services/VideoDomainService";
import { Video } from "../../../../../domain/models/Video";
import {myContainer} from "../../../../config/inversify.config";
import {Types} from "../../../../config/Types";
import {IVideoDomainService} from "../../../../../domain/port/primary/IVideoDomainService";

const videoDomainService = myContainer.get<IVideoDomainService>(Types.IVideoDomainService);

const videoResolver = {
    Query: {
        getAllVideos: async (_: any, {}: {}) => {
            return videoDomainService.findAllVideos();
        },
        getVideo: async (_: any, { id }: { id: string }) => {
            return videoDomainService.findById(id);
        },
    },
    Mutation: {
        createVideo: async (_: any, { title, id }: { title: string; id: string }) => {
            const newVideo = new Video();
            newVideo.title = title;
            newVideo.id = id;
            newVideo.createdAt = new Date();
            const videos: Video[] = [newVideo]
            return videoDomainService.saveVideos(videos);
        },
    },
};

export default videoResolver;