"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("../entity/UserEntity"); // Verifica que la ruta a tu entidad sea correcta
require("dotenv/config");
const SupportMessageEntity_1 = require("../entity/SupportMessageEntity"); // Asegúrate de importar dotenv al inicio del archivo
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : "", 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [UserEntity_1.UserEntity, SupportMessageEntity_1.SupportMessageEntity],
    synchronize: true,
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
