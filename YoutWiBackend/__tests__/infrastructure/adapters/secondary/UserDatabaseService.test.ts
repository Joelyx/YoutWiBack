import {UserDatabaseService} from "../../../../src/infrastructure/adapters/secondary/services/UserDatabaseService";
import UserEntityRepository from "../../../../src/infrastructure/repositories/mysql/UserEntityRepository";
import {User} from "../../../../src/domain/models/User";
import {UserEntity} from "../../../../src/infrastructure/entity/UserEntity";
import {executeQuery} from "../../../../src/infrastructure/config/Neo4jDataSource";


jest.mock('../../../../src/infrastructure/config/Neo4jDataSource');
jest.mock('../../../../src/infrastructure/repositories/mysql/UserEntityRepository');

describe('UserDatabaseService', () => {
    let service: UserDatabaseService;
    let userEntityRepositoryMock: jest.Mocked<typeof UserEntityRepository>;

    beforeEach(() => {
        service = new UserDatabaseService();
        userEntityRepositoryMock = UserEntityRepository as jest.Mocked<typeof UserEntityRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save user', async () => {
        const user = new User();
        user.setId = 1;
        user.setUsername = 'testuser';
        const userEntity = new UserEntity();
        userEntity.id = user.getId;
        userEntity.username = user.getUsername;

        userEntityRepositoryMock.save.mockResolvedValue(userEntity);

        const result = await service.save(user);

        const expectedUser = new User();
        expectedUser.setId = 1;
        expectedUser.setUsername = 'testuser';
        expectedUser.setGoogleId = '';
        expectedUser.setPassword = "";
        expectedUser.setRole = "undefined";
        expectedUser.setEmail = "undefined";
        expectedUser.setCreatedAt = new Date();
        expectedUser.setUpdatedAt = new Date();
        expectedUser.setDeletedAt = new Date();
        expectedUser.setUid = "undefined";
        expectedUser.setActive = false;

        expect(userEntityRepositoryMock.save).toHaveBeenCalledWith(expect.any(UserEntity));
        expect(result).not.toBeNull();
        if(result)
            expect(result.getId).toEqual(expectedUser.getId);
    });

    it('should register user', async () => {
        const user = new User();
        user.setId = 1;
        user.setUsername = 'testuser';
        const userEntity = new UserEntity();
        userEntity.id = user.getId;
        userEntity.username = user.getUsername;
        const userProps = service.mapUserToNeo4jProperties(user);

        userEntityRepositoryMock.save.mockResolvedValue(userEntity);
        (executeQuery as jest.Mock).mockResolvedValue([{ get: jest.fn() }]);

        const result = await service.register(user);

        const expectedUser = new User();
        expectedUser.setId = 1;
        expectedUser.setUsername = 'testuser';
        expectedUser.setGoogleId = '';
        expectedUser.setPassword = "";
        expectedUser.setRole = "undefined";
        expectedUser.setEmail = "undefined";
        expectedUser.setCreatedAt = new Date();
        expectedUser.setUpdatedAt = new Date();
        expectedUser.setDeletedAt = new Date();
        expectedUser.setUid = "undefined";
        expectedUser.setActive = false;

        expect(userEntityRepositoryMock.save).toHaveBeenCalledWith(expect.any(UserEntity));
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), userProps);
        expect(result).not.toBeNull();
        if(result)
            expect(result.getId).toEqual(expectedUser.getId);
    });

    it('should delete user by id', async () => {
        const userId = 1;
        await service.deleteById(userId);
        expect(userEntityRepositoryMock.deleteById).toHaveBeenCalledWith(userId);
    });

    it('should find user by id', async () => {
        const userId = 1;
        const userEntity = new UserEntity();
        userEntity.id = userId;
        userEntity.username = 'testuser';

        userEntityRepositoryMock.findById.mockResolvedValue(userEntity);

        const result = await service.findById(userId);

        expect(userEntityRepositoryMock.findById).toHaveBeenCalledWith(userId);
        expect(result).toEqual(service.mapUserEntityToUser(userEntity));
    });

    it('should find user by username', async () => {
        const username = 'testuser';
        const userEntity = new UserEntity();
        userEntity.username = username;

        userEntityRepositoryMock.findByUsername.mockResolvedValue(userEntity);

        const result = await service.findByUsername(username);

        expect(userEntityRepositoryMock.findByUsername).toHaveBeenCalledWith(username);
        expect(result).toEqual(service.mapUserEntityToUser(userEntity));
    });

    it('should find user by email', async () => {
        const email = 'testuser@example.com';
        const userEntity = new UserEntity();
        userEntity.email = email;

        userEntityRepositoryMock.findByEmail.mockResolvedValue(userEntity);

        const result = await service.findByEmail(email);

        expect(userEntityRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
        expect(result).toEqual(service.mapUserEntityToUser(userEntity));
    });

    it('should find all users', async () => {
        const userEntities = [
            { id: 1, username: 'testuser1' } as UserEntity,
            { id: 2, username: 'testuser2' } as UserEntity,
        ];

        userEntityRepositoryMock.findAll.mockResolvedValue(userEntities);

        const result = await service.findAll();

        expect(userEntityRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(userEntities.length);
        expect(result[0].getUsername).toEqual(userEntities[0].username);
    });

    it('should update user active status', async () => {
        const userId = 1;
        const active = true;
        const userEntity = new UserEntity();
        userEntity.id = userId;
        userEntity.active = active;

        userEntityRepositoryMock.findById.mockResolvedValue(userEntity);
        userEntityRepositoryMock.save.mockResolvedValue(userEntity);

        const result = await service.updateActive(userId, active);

        expect(userEntityRepositoryMock.findById).toHaveBeenCalledWith(userId);
        expect(userEntityRepositoryMock.save).toHaveBeenCalledWith(userEntity);
        expect(result).toEqual(service.mapUserEntityToUser(userEntity));
    });

    it('should count users', async () => {
        userEntityRepositoryMock.count.mockResolvedValue(10);

        const result = await service.count();

        expect(userEntityRepositoryMock.count).toHaveBeenCalled();
        expect(result).toBe(10);
    });

});
