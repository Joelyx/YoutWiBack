"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("../entity/UserEntity"); // Asegúrate de que la ruta sea correcta
//100.116.194.53
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql", // o cualquier otro tipo de base de datos que estés utilizando
    host: "100.116.194.53",
    port: 3307,
    username: "root",
    password: "634569",
    database: "youtwi",
    entities: [UserEntity_1.UserEntity],
    synchronize: true, // CUIDADO: esto sincronizará los modelos con la base de datos, si no quieres que esto suceda, establece esta opción en false
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
