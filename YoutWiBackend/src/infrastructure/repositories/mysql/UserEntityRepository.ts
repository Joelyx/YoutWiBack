
import { UserEntity } from '../../entity/UserEntity';
import {AppDataSource} from "../../config/DataSource";
import {Like} from "typeorm";

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
        return this.userRepository.findOne({ where: { uid: uid } });
    }

    async findByGoogleId(googleId: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { googleId } });
    }

    async findStartsWithUsername(username: string): Promise<UserEntity[]> {
        return this.userRepository.find({
            where: {
                username: Like(`%${username}%`)
            }
        });
    }

    async updateActive(id: number, active: boolean): Promise<UserEntity | null> {
        const user = await this.findById(id);
        if (user) {
            user.active = active;
            return this.save(user);
        }
        return null;
    }

    async count(): Promise<number> {
        return this.userRepository.count();
    }
}

export default new UserEntityRepository();
