"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebSocketToken = exports.verifyAdminToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Asume que el token viene en el formato "Bearer TOKEN"
    if (!token)
        return res.status(403).send({ error: "Token requerido" });
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).send({ error: "Token inválido" });
        // Decoded contiene los datos del usuario que fueron incluidos en el token
        req.user = decoded; // Ahora puedes acceder a req.user en tus controladores/rutas siguientes
        next();
    });
};
exports.verifyToken = verifyToken;
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(403).send({ error: "Token requerido" });
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: "Token inválido" });
        }
        if (decoded.role !== 'ROLE_ADMIN') {
            return res.status(403).send({ error: "Acceso denegado: se requiere rol de administrador" });
        }
        req.user = decoded;
        next();
    });
};
exports.verifyAdminToken = verifyAdminToken;
const verifyWebSocketToken = (token, ws, callback) => {
    if (!token) {
        ws.close(4002, 'Token not provided');
        callback(new Error("Token not provided"));
        return;
    }
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, decoded) => {
        if (err) {
            ws.close(4001, 'Invalid token');
            callback(err);
        }
        else {
            callback(null, decoded); // Decoded contiene los datos del usuario
        }
    });
};
exports.verifyWebSocketToken = verifyWebSocketToken;
