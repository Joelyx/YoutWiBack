import { SupportMessageEntity } from '../../entity/SupportMessageEntity';
import { AppDataSource } from "../../config/DataSource";

class SupportMessageRepository {
    private supportMessageRepository = AppDataSource.getRepository(SupportMessageEntity);

    async save(supportMessage: SupportMessageEntity): Promise<SupportMessageEntity> {
        return this.supportMessageRepository.save(supportMessage);
    }

    async deleteById(messageId: number): Promise<void> {
        await this.supportMessageRepository.delete(messageId);
    }

    async findById(messageId: number): Promise<SupportMessageEntity | null> {
        return this.supportMessageRepository.findOne({ where: { id: messageId } });
    }

    async findAllByUserId(userId: number): Promise<SupportMessageEntity[]> {
        return this.supportMessageRepository.find({ where: { userId } });
    }

    async findRecentMessagesByUserId(userId: number, limit: number = 10): Promise<SupportMessageEntity[]> {
        return this.supportMessageRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit
        });
    }

    async findAllSupportMessages(): Promise<SupportMessageEntity[]> {
        return this.supportMessageRepository.find({ where: { isFromSupport: true } });
    }

    async findAllUserMessages(userId: number): Promise<SupportMessageEntity[]> {
        return this.supportMessageRepository.find({ where: { userId, isFromSupport: false } });
    }
}

export default new SupportMessageRepository();