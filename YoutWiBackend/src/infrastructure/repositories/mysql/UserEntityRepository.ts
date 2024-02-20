
import { UserEntity } from '../../entity/UserEntity';
import {AppDataSource} from "../../config/DataSource";

class UserEntityRepository {
    private userRepository = AppDataSource.getRepository(UserEntity);

    async save(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
    }

    async deleteById(userId: number): Promise<void> {
        await this.userRepository.delete(userId);
    }

    async findById(userId: number): Promise<UserEntity | null> {
        return  this.userRepository.findOne({where: {id: userId}});
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async findByUid(uid: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { uid } });
    }

    async findByGoogleId(googleId: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { googleId } });
    }
}

export default new UserEntityRepository();
