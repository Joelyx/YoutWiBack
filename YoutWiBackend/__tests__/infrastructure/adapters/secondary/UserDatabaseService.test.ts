import { UserDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/UserDatabaseService";
import UserEntityRepository from "../../../../src/infrastructure/repositories/mysql/UserEntityRepository";
import { executeQuery } from "../../../../src/infrastructure/config/Neo4jDataSource";
import {User} from "../../../../src/domain/models/User";
import {Record} from "neo4j-driver";

jest.mock("../../../../src/infrastructure/repositories/mysql/UserEntityRepository");
jest.mock("../../../../src/infrastructure/config/Neo4jDataSource");

const mockedUserRepository = UserEntityRepository as jest.Mocked<typeof UserEntityRepository>;
const mockedExecuteQuery = executeQuery as jest.MockedFunction<typeof executeQuery>;


describe('UserDatabaseService', () => {
    let service: UserDatabaseService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UserDatabaseService();
    });

    describe('save', () => {
        it('should save a user', async () => {
            const user = new User();
            user.setId = 1;
            user.setUsername = "testUser";
            mockedUserRepository.save.mockResolvedValue(service.mapUserToUserEntity(user));
            const result = await service.save((user));
            expect(UserEntityRepository.save).toHaveBeenCalledWith(expect.anything());
            expect(result).toEqual(user);
        });
    });

    describe('register', () => {
        it('should register a user', async () => {
            const user = new User();
            user.setId = 1;
            user.setUsername = "newUser";
            user.setEmail = "new@example.com";
            mockedUserRepository.save.mockResolvedValue(service.mapUserToUserEntity(user));
            mockedExecuteQuery.mockResolvedValueOnce([new Record(['user'], [user])]);
            const result = await service.register(user);
            expect(UserEntityRepository.save).toHaveBeenCalledWith(expect.anything());
            expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining("CREATE"), expect.anything());
            expect(result).toEqual(user);
        });
    });

    describe('deleteById', () => {
        it('should delete a user by id', async () => {
            const userId = 1;
            await service.deleteById(userId);
            expect(UserEntityRepository.deleteById).toHaveBeenCalledWith(userId);
        });
    });

    describe('findById', () => {
        it('should find a user by id', async () => {
            const userId = 1;
            const user = new User();
            user.setId = userId;
            user.setUsername = "foundUser";
            mockedUserRepository.findById.mockResolvedValue(user);
            const result = await service.findById(userId);
            expect(UserEntityRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(user);
        });
    });

    describe('followOrUnfollowUser', () => {
        it('should handle follow/unfollow correctly', async () => {
            const follower = new User();
            follower.setId = 1;
            const followed = new User();
            followed.setId = 2;

            mockedExecuteQuery.mockResolvedValueOnce([{ get: () => 0 }]);
            mockedExecuteQuery.mockResolvedValueOnce([]);

            await service.followOrUnfollowUser(follower, followed);
            expect(executeQuery).toHaveBeenCalledTimes(2);
            expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining("DELETE r"), expect.anything());
            expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining("CREATE"), expect.anything());
        });
    });

    describe('findByUsername', () => {
        it('should find a user by username', async () => {
            const username = "userTest";
            const user = new User();
            user.setId = 1;
            user.setUsername = username;
            mockedUserRepository.findByUsername.mockResolvedValue(user);

            const result = await service.findByUsername(username);
            expect(UserEntityRepository.findByUsername).toHaveBeenCalledWith(username);
            expect(result).toEqual(user);
        });
    });

    describe('findByEmail', () => {
        it('should find a user by email', async () => {
            const email = "test@example.com";
            const user = new User();
            user.setId = 1;
            user.setEmail = email;
            mockedUserRepository.findByEmail.mockResolvedValue(user);

            const result = await service.findByEmail(email);
            expect(UserEntityRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(user);
        });
    });

    describe('findAll', () => {
        it('should find all users', async () => {
            const user = new User();
            user.setId = 1;
            user.setUsername = "findAllUser";
            mockedUserRepository.findAll.mockResolvedValue([user]);

            const result = await service.findAll();
            expect(UserEntityRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual([user]);
        });
    });

    describe('findByUid', () => {
        it('should find a user by UID', async () => {
            const uid = "12345";
            const user = new User();
            user.setId = 1;
            user.setUid = uid;
            mockedUserRepository.findByUid.mockResolvedValue(user);

            const result = await service.findByUid(uid);
            expect(UserEntityRepository.findByUid).toHaveBeenCalledWith(uid);
            expect(result).toEqual(user);
        });
    });

    describe('findByGoogleIdOrCreate', () => {
        it('should find or create a user by Google ID', async () => {
            const googleId = "google-create-123";
            const user = new User();
            user.setId = 1;
            user.setGoogleId = googleId;

            mockedUserRepository.findByGoogleId.mockResolvedValue(null);
            mockedUserRepository.save.mockResolvedValue(service.mapUserToUserEntity(user));
            mockedExecuteQuery.mockResolvedValueOnce([new Record(['id'], [1])]);

            const newUser = new User();
            newUser.setUsername = "newGoogleUser";
            newUser.setEmail = "new@google.com";

            const result = await service.findByGoogleIdOrCreate(googleId, service.mapUserToUserEntity(newUser));
            expect(UserEntityRepository.findByGoogleId).toHaveBeenCalledWith(googleId);
            expect(UserEntityRepository.save).toHaveBeenCalledWith(expect.anything());
            expect(result).toEqual(user);
        });
    });

    describe('findByGoogleIdOrCreate', () => {
        it('should find or create a user by Google ID', async () => {
            const googleId = "google-create-123";
            const user = new User();
            user.setId = 1;
            user.setGoogleId = googleId;

            mockedUserRepository.findByGoogleId.mockResolvedValue(null);
            mockedUserRepository.save.mockResolvedValue(user);
            mockedExecuteQuery.mockResolvedValue([{ get: () => ({ id: 1 }) }]);

            const newUser = new User();
            newUser.setUsername = "newGoogleUser";
            newUser.setEmail = "new@google.com";

            const result = await service.findByGoogleIdOrCreate(googleId, newUser);
            expect(UserEntityRepository.findByGoogleId).toHaveBeenCalledWith(googleId);
            expect(UserEntityRepository.save).toHaveBeenCalledWith(expect.anything());
            expect(result).toEqual(user);
        });
    });

    describe('findStartsWithUsername', () => {
        it('should find users with usernames that start with a given prefix', async () => {
            const prefix = "start";
            const user = new User();
            user.setId = 1;
            user.setUsername = "startsWithUser";
            mockedUserRepository.findStartsWithUsername.mockResolvedValue([user]);

            const result = await service.findStartsWithUsername(prefix);
            expect(UserEntityRepository.findStartsWithUsername).toHaveBeenCalledWith(prefix);
            expect(result).toEqual([user]);
        });
    });

});

