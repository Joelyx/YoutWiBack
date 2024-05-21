import "reflect-metadata";
import {
    BroadcasterDatabaseService
} from "../../../../src/infrastructure/adapters/secondary/services/BroadcasterDatabaseService";
import { Broadcaster } from "../../../../src/domain/models/Broadcaster";
import * as db from "../../../../src/infrastructure/config/Neo4jDataSource";

jest.mock("../../../../src/infrastructure/config/Neo4jDataSource", () => ({
    executeQuery: jest.fn()
}));

describe('BroadcasterDatabaseService', () => {
    let service: BroadcasterDatabaseService;
    let mockExecuteQuery: jest.Mock;

    beforeEach(() => {
        service = new BroadcasterDatabaseService();
        mockExecuteQuery = db.executeQuery as jest.Mock;
        mockExecuteQuery.mockClear();
    });

    describe('saveBroadcasters', () => {
        it('should execute a query for each broadcaster', async () => {
            const broadcaster1 = new Broadcaster();
            broadcaster1.id = "1";
            broadcaster1.name = "Broadcaster One";

            const broadcaster2 = new Broadcaster();
            broadcaster2.id = "2";
            broadcaster2.name = "Broadcaster Two";

            const broadcasters = [broadcaster1, broadcaster2];
            await service.saveBroadcasters(broadcasters);
            expect(mockExecuteQuery).toHaveBeenCalledTimes(2);
        });

        it('should handle an empty array of broadcasters', async () => {
            await service.saveBroadcasters([]);
            expect(mockExecuteQuery).not.toHaveBeenCalled();
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            const broadcaster = new Broadcaster();
            broadcaster.id = "3";
            broadcaster.name = "Broadcaster Three";

            await expect(service.saveBroadcasters([broadcaster])).rejects.toThrow("Database error");
        });
    });

    describe('saveFollowed', () => {

        it('should handle an empty array of broadcasters', async () => {
            await service.saveFollowed("user1", []);
            expect(mockExecuteQuery).not.toHaveBeenCalled();
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            const broadcaster = new Broadcaster();
            broadcaster.id = "3";
            broadcaster.name = "Broadcaster Three";

            await expect(service.saveFollowed("user1", [broadcaster])).rejects.toThrow("Database error");
        });
    });

    describe('findUserFollowedBroadcasters', () => {
        it('should return broadcasters followed by a user', async () => {
            mockExecuteQuery.mockResolvedValueOnce([
                { get: () => ({ properties: { id: "1", name: "Broadcaster One" } }) }
            ]);
            const result = await service.findUserFollowedBroadcasters("user1");
            expect(result.length).toBe(1);
            expect(result[0].id).toBe("1");
            expect(result[0].name).toBe("Broadcaster One");
        });

        it('should return an empty array if no broadcasters are followed', async () => {
            mockExecuteQuery.mockResolvedValueOnce([]);
            const result = await service.findUserFollowedBroadcasters("user1");
            expect(result).toEqual([]);
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            await expect(service.findUserFollowedBroadcasters("user1")).rejects.toThrow("Database error");
        });


    });

});
