import {SupportMessageEntity} from "../../../infrastructure/entity/SupportMessageEntity";

export interface ISupportMessageDomainService {
    save(supportMessage: SupportMessageEntity): Promise<SupportMessageEntity>;
    deleteById(messageId: number): Promise<void>;
    findById(messageId: number): Promise<SupportMessageEntity | null>;
    findAllByUserId(userId: number): Promise<SupportMessageEntity[]>;
    findRecentMessagesByUserId(userId: number, limit?: number): Promise<SupportMessageEntity[]>;
    findAllSupportMessages(): Promise<SupportMessageEntity[]>;
    findAllUserMessages(userId: number): Promise<SupportMessageEntity[]>;
}

