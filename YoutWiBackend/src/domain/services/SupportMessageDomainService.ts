import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/config/Types";
import { ISupportMessageRepository } from "../port/secondary/ISupportMessageRepository";
import {SupportMessageEntity} from "../../infrastructure/entity/SupportMessageEntity";
import {ISupportMessageDomainService} from "../port/primary/ISupportMessageDomainService";

@injectable()
export class SupportMessageDomainService implements ISupportMessageDomainService {
    private repository: ISupportMessageRepository;

    constructor(@inject(Types.ISupportMessageRepository) repository: ISupportMessageRepository) {
        this.repository = repository;
    }

    save(supportMessage: SupportMessageEntity): Promise<SupportMessageEntity> {
        return this.repository.save(supportMessage);
    }

    deleteById(messageId: number): Promise<void> {
        return this.repository.deleteById(messageId);
    }

    findById(messageId: number): Promise<SupportMessageEntity | null> {
        return this.repository.findById(messageId);
    }

    findAllByUserId(userId: number): Promise<SupportMessageEntity[]> {
        return this.repository.findAllByUserId(userId);
    }

    findRecentMessagesByUserId(userId: number, limit?: number): Promise<SupportMessageEntity[]> {
        return this.repository.findRecentMessagesByUserId(userId, limit);
    }

    findAllSupportMessages(): Promise<SupportMessageEntity[]> {
        return this.repository.findAllSupportMessages();
    }

    findAllUserMessages(userId: number): Promise<SupportMessageEntity[]> {
        return this.repository.findAllUserMessages(userId);
    }
}