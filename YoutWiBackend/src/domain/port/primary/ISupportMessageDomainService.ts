import {SupportMessage} from "../../models/SupportMessage";

export interface ISupportMessageDomainService {
    save(supportMessage: SupportMessage): Promise<SupportMessage>;
    deleteById(messageId: number): Promise<void>;
    findById(messageId: number): Promise<SupportMessage | null>;
    findAllByUserId(userId: number): Promise<SupportMessage[]>;
    findRecentMessagesByUserId(userId: number, limit?: number): Promise<SupportMessage[]>;
    findAllSupportMessages(): Promise<SupportMessage[]>;
    findAllUserMessages(userId: number): Promise<SupportMessage[]>;
}