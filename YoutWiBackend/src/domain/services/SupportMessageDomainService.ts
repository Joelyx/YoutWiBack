import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/config/Types";
import { ISupportMessageRepository } from "../port/secondary/ISupportMessageRepository";
import {ISupportMessageDomainService} from "../port/primary/ISupportMessageDomainService";
import {SupportMessage} from "../models/SupportMessage";

@injectable()
export class SupportMessageDomainService implements ISupportMessageDomainService {
    private repository: ISupportMessageRepository;

    constructor(@inject(Types.ISupportMessageRepository) repository: ISupportMessageRepository) {
        this.repository = repository;
    }

    save(supportMessage: SupportMessage): Promise<SupportMessage> {
        return this.repository.save(supportMessage);
    }

    deleteById(messageId: number): Promise<void> {
        return this.repository.deleteById(messageId);
    }

    findById(messageId: number): Promise<SupportMessage | null> {
        return this.repository.findById(messageId);
    }

    findAllByUserId(userId: number): Promise<SupportMessage[]> {
        return this.repository.findAllByUserId(userId);
    }

    findRecentMessagesByUserId(userId: number, limit?: number): Promise<SupportMessage[]> {
        return this.repository.findRecentMessagesByUserId(userId, limit);
    }

    findAllSupportMessages(): Promise<SupportMessage[]> {
        return this.repository.findAllSupportMessages();
    }

    findAllUserMessages(userId: number): Promise<SupportMessage[]> {
        return this.repository.findAllUserMessages(userId);
    }
}