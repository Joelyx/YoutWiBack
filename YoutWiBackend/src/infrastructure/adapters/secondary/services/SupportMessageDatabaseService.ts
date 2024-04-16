import {injectable} from "inversify";
import {ISupportMessageRepository} from "../../../../domain/port/secondary/ISupportMessageRepository";
import {SupportMessageEntity} from "../../../entity/SupportMessageEntity";
import SupportMessageEntityRepository from "../../../repositories/mysql/SupportMessageEntityRepository";


@injectable()
export class SupportMessageDatabaseService implements ISupportMessageRepository {
    private SupportMessageRepository = SupportMessageEntityRepository;

    deleteById(messageId: number): Promise<void> {
        return this.SupportMessageRepository.deleteById(messageId);
    }

    findAllByUserId(userId: number): Promise<SupportMessageEntity[]> {
        return this.SupportMessageRepository.findAllByUserId(userId);
    }

    findAllSupportMessages(): Promise<SupportMessageEntity[]> {
        return this.SupportMessageRepository.findAllSupportMessages();
    }

    findAllUserMessages(userId: number): Promise<SupportMessageEntity[]> {
        return this.SupportMessageRepository.findAllUserMessages(userId);
    }

    findById(messageId: number): Promise<SupportMessageEntity | null> {
        return this.SupportMessageRepository.findById(messageId);
    }

    findRecentMessagesByUserId(userId: number, limit?: number): Promise<SupportMessageEntity[]> {
        return this.SupportMessageRepository.findRecentMessagesByUserId(userId, limit);
    }

    save(supportMessage: SupportMessageEntity): Promise<SupportMessageEntity> {
        return this.SupportMessageRepository.save(supportMessage);
    }

}