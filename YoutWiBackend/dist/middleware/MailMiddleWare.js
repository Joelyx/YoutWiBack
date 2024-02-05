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
exports.mailMiddleWare = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailMiddleWare {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail", // Use 'service' instead of 'host'
            port: 587, // No need to convert to Number
            secure: false, // 'secure' should be a boolean
            auth: {
                user: "joelhernandezmartin01@gmail.com",
                pass: "tyze hdxq ptvv xydi",
            },
        });
    }
    sendAccountConfirmationEmail(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `"Nombre de tu Aplicación" <${process.env.SMTP_FROM}>`, // email del remitente
                to: to, // email del destinatario
                subject: "Confirma tu Cuenta", // Asunto
                text: `Por favor confirma tu cuenta haciendo clic en este enlace: ${process.env.FRONTEND_URL}/api/auth/confirm/${token}`, // cuerpo del texto
                html: `<b>Por favor confirma tu cuenta haciendo clic en este enlace:</b> <a href="${process.env.FRONTEND_URL}/api/auth/confirm/${token}">Confirmar Cuenta</a>`, // cuerpo HTML
            };
            try {
                yield this.transporter.sendMail(mailOptions);
                console.log(`Email de confirmación enviado a ${to}`);
            }
            catch (error) {
                console.error(`Error al enviar email a ${to}: `, error);
                throw error; // O maneja este error según sea necesario para tu aplicación
            }
        });
    }
}
exports.mailMiddleWare = new MailMiddleWare();
