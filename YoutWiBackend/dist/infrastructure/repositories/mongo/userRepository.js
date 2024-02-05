"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoConnection_1 = __importDefault(require("../../config/mongoConnection"));
// Ejemplo de uso con un modelo Mongoose
const schema = new mongoConnection_1.default.Schema({
// Definiciones del esquema
});
const MiModelo = mongoConnection_1.default.model('MiModelo', schema);
// Ejemplo de consulta
MiModelo.find();
