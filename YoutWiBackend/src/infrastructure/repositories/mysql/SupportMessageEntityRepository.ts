import { SupportMessageEntity } from '../../entity/SupportMessageEntity';
import { AppDataSource } from "../../config/DataSource";
import { SupportMessage } from "../../../domain/models/SupportMessage";

class SupportMessageRepository {
    private supportMessageRepository = AppDataSource.getRepository(SupportMessageEntity);

    async save(supportMessage: SupportMessage): Promise<SupportMessage> {
        const entity = this.mapToEntity(supportMessage);
        const savedEntity = await this.supportMessageRepository.save(entity);
        return this.mapToSupportMessage(savedEntity);
    }

    async deleteById(messageId: number): Promise<void> {
        await this.supportMessageRepository.delete(messageId);
    }

    async findById(messageId: number): Promise<SupportMessage | null> {
        const entity = await this.supportMessageRepository.findOne({ where: { id: messageId } });
        return entity ? this.mapToSupportMessage(entity) : null;
    }

    async findAllByUserId(userId: number): Promise<SupportMessage[]> {
        userId = 26;
        const entities = await this.supportMessageRepository.find({ where: { userId } });
        return entities.map(this.mapToSupportMessage);
    }

    async findRecentMessagesByUserId(userId: number, limit: number = 10): Promise<SupportMessage[]> {
        const entities = await this.supportMessageRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit
        });
        return entities.map(this.mapToSupportMessage);
    }

    async findAllSupportMessages(): Promise<SupportMessage[]> {
        const entities = await this.supportMessageRepository.find();
        return entities.map(this.mapToSupportMessage);
    }

    async findAllUserMessages(userId: number): Promise<SupportMessage[]> {
        userId = 26;
        const entities = await this.supportMessageRepository.find({ where: {userId} });
        console.log(entities);
        return entities.map(this.mapToSupportMessage);
    }

    private mapToSupportMessage(entity: SupportMessageEntity): SupportMessage {
        const domainObject = new SupportMessage();
        domainObject.id = entity.id;
        domainObject.userId = entity.userId;
        domainObject.message = entity.message;
        domainObject.createdAt = entity.createdAt;
        domainObject.isFromSupport = entity.isFromSupport;
        return domainObject;
    }

    private mapToEntity(domain: SupportMessage): SupportMessageEntity {
        const entity = new SupportMessageEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.message = domain.message;
        entity.createdAt = domain.createdAt;
        entity.isFromSupport = domain.isFromSupport;
        return entity;
    }
}

export default new SupportMessageRepository();
