"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../../config/config");
const user_1 = require("../../../../domain/models/user");
const types_1 = require("../../../config/types");
const uuid_1 = require("uuid");
const MailMiddleWare_1 = require("../../../../middleware/MailMiddleWare");
const inversify_1 = require("inversify");
const google_auth_library_1 = require("google-auth-library");
let AuthController = class AuthController {
    // Función de registro
    constructor(service) {
        this.service = service;
        /**
         * @openai
         * @param req
         * @param res
         */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, email } = req.body;
                // Cifrar la contraseña
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // crear una uid aleotoria
                const uid = (0, uuid_1.v4)();
                // Crear el usuario (aquí deberías guardar el usuario en tu DB)
                const newUser = new user_1.User();
                newUser.setUsername = username;
                newUser.setPassword = hashedPassword;
                newUser.setEmail = email;
                console.log(email);
                newUser.setUid = uid;
                // Guardar newUser en la base de datos
                // const savedUser = await userRepository.save(newUser);
                try {
                    yield MailMiddleWare_1.mailMiddleWare.sendAccountConfirmationEmail(email, uid);
                    let usuarioRegistrado = yield this.service.register(newUser);
                }
                catch (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Error al enviar email de confirmación. Cuenta no creada" });
                }
                return res.status(201).json({ message: "Usuario registrado exitosamente" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error en el servidor" });
            }
        });
        // Función de login
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                // Aquí deberías buscar el usuario en tu base de datos
                // const user = await userRepository.findOne({ username });
                const user = yield this.service.findByUsername(username);
                if (!(user === null || user === void 0 ? void 0 : user.getActive)) {
                    return res.status(400).json({ error: "Usuario no activo" });
                }
                // Verificar la contraseña
                if (user && (yield bcrypt_1.default.compare(password, user.getPassword))) {
                    // Generar token JWT
                    const token = jsonwebtoken_1.default.sign({ userId: user.getId, username: user.getUsername, role: user.getRole }, config_1.JWT_SECRET, { expiresIn: '7d' });
                    console.log("Login exitoso" + token);
                    return res.json({ message: "Login exitoso", token });
                }
                return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error en el servidor\n" + error.message });
            }
        });
    }
    verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params; // Asume que el token se envía como parte de la URL
            try {
                const user = yield this.service.findByUid(token);
                if (!user) {
                    return res.status(404).json({ message: 'Usuario no encontrado o token inválido.' });
                }
                user.setActive = true;
                yield this.service.save(user);
                return res.status(200).json({ message: 'Cuenta verificada con éxito.' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al verificar la cuenta.' });
            }
        });
    }
    googleAuthCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // El usuario ya debería estar autenticado por Google y procesado por Passport a este punto
            // Passport automáticamente adjunta el usuario al objeto req
            const user = req.user;
            console.log("login con google" + user);
            if (!user) {
                return res.status(401).json({ message: 'Error en la autenticación de Google.' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, config_1.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token });
        });
    }
    ;
    googleAuth(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            {
                const { token } = req.body;
                try {
                    const payload = yield this.verifyToken(token);
                    if (!payload) {
                        return res.status(401).json({ message: 'Autenticación fallida' });
                    }
                    let findByEmail = yield this.service.findByEmail((_a = payload.email) !== null && _a !== void 0 ? _a : "noexiste");
                    if (findByEmail != null) {
                        if (findByEmail.getGoogleId == null) {
                            return res.status(401).json({ message: 'El email ya está registrado' });
                        }
                        else {
                            const jwtToken = jsonwebtoken_1.default.sign({
                                userId: findByEmail === null || findByEmail === void 0 ? void 0 : findByEmail.getId,
                                username: findByEmail === null || findByEmail === void 0 ? void 0 : findByEmail.getUsername,
                                role: findByEmail === null || findByEmail === void 0 ? void 0 : findByEmail.getRole
                            }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
                            res.json({ message: 'Autenticación exitosa', token: jwtToken });
                        }
                    }
                    else {
                        let user = new user_1.User();
                        user.setEmail = (_b = payload.email) !== null && _b !== void 0 ? _b : "";
                        user.setUsername = (_c = payload.name) !== null && _c !== void 0 ? _c : "";
                        user.setGoogleId = token;
                        user.setUid = (0, uuid_1.v4)();
                        user.setPassword = (0, uuid_1.v4)();
                        user.setActive = true;
                        user = yield this.service.findByGoogleIdOrCreate(token, user);
                        console.log(user);
                        if (user) {
                            const jwtToken = jsonwebtoken_1.default.sign({
                                userId: user === null || user === void 0 ? void 0 : user.getId,
                                username: user === null || user === void 0 ? void 0 : user.getUsername,
                                role: user === null || user === void 0 ? void 0 : user.getRole
                            }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
                            res.json({ message: 'Autenticación exitosa', token: jwtToken });
                        }
                        else {
                            res.status(401).json({ message: 'Autenticación fallida' });
                        }
                    }
                }
                catch (error) {
                    console.error('Error verificando el token de Google:', error);
                    res.status(401).json({ message: 'Autenticación fallida' });
                }
            }
        });
    }
    ;
    verifyToken(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = yield client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID, // Especifica el CLIENT_ID de tu app
            });
            const payload = ticket.getPayload();
            console.log(payload);
            return payload;
        });
    }
};
AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserDomainService)),
    __metadata("design:paramtypes", [Object])
], AuthController);
exports.default = AuthController;
