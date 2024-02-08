"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'; // URI de tu instancia de Neo4j
const user = process.env.NEO4J_USER || 'neo4j'; // Usuario de tu instancia de Neo4j
const password = process.env.NEO4J_PASSWORD || 'neo4j'; // Contraseña de tu instancia de Neo4j
const driver = neo4j_driver_1.default.driver(uri, neo4j_driver_1.default.auth.basic(user, password));
function executeQuery(query, parameters = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = driver.session();
        try {
            const result = yield session.run(query, parameters);
            return result.records;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield session.close();
        }
    });
}
exports.executeQuery = executeQuery;
