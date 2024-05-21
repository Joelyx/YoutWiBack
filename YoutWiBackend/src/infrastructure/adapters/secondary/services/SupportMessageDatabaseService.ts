import {injectable} from "inversify";
import {ISupportMessageRepository} from "../../../../domain/port/secondary/ISupportMessageRepository";
import {SupportMessage} from "../../../../domain/models/SupportMessage"
import SupportMessageEntityRepository from "../../../repositories/mysql/SupportMessageEntityRepository";


@injectable()
export class SupportMessageDatabaseService implements ISupportMessageRepository {
    private SupportMessageRepository = SupportMessageEntityRepository;

    deleteById(messageId: number): Promise<void> {
        return this.SupportMessageRepository.deleteById(messageId);
    }

    findAllByUserId(userId: number): Promise<SupportMessage[]> {
        return this.SupportMessageRepository.findAllByUserId(userId);
    }

    findAllSupportMessages(): Promise<SupportMessage[]> {
        return this.SupportMessageRepository.findAllSupportMessages();
    }

    findAllUserMessages(userId: number): Promise<SupportMessage[]> {
        return this.SupportMessageRepository.findAllUserMessages(userId);
    }

    findById(messageId: number): Promise<SupportMessage | null> {
        return this.SupportMessageRepository.findById(messageId);
    }

    findRecentMessagesByUserId(userId: number, limit?: number): Promise<SupportMessage[]> {
        return this.SupportMessageRepository.findRecentMessagesByUserId(userId, limit);
    }

    save(supportMessage: SupportMessage): Promise<SupportMessage> {
        return this.SupportMessageRepository.save(supportMessage);
    }

}