"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token)
        return res.status(403).send({ error: "Token requerido" });
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).send({ error: "Token inválido" });
        req.user = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
