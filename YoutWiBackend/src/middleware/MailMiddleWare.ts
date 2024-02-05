import nodemailer, { Transporter } from 'nodemailer';

class MailMiddleWare {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail", // Use 'service' instead of 'host'
            port: 587, // No need to convert to Number
            secure: false, // 'secure' should be a boolean
            auth: {
                user: "joelhernandezmartin01@gmail.com",
                pass: "tyze hdxq ptvv xydi",
            },
        });
    }

    async sendAccountConfirmationEmail(to: string, token: string): Promise<void> {
        const mailOptions = {
            from: `"Nombre de tu Aplicación" <${process.env.SMTP_FROM}>`, // email del remitente
            to: to, // email del destinatario
            subject: "Confirma tu Cuenta", // Asunto
            text: `Por favor confirma tu cuenta haciendo clic en este enlace: ${process.env.FRONTEND_URL}/api/auth/confirm/${token}`, // cuerpo del texto
            html: `<b>Por favor confirma tu cuenta haciendo clic en este enlace:</b> <a href="${process.env.FRONTEND_URL}/api/auth/confirm/${token}">Confirmar Cuenta</a>`, // cuerpo HTML
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email de confirmación enviado a ${to}`);
        } catch (error) {
            console.error(`Error al enviar email a ${to}: `, error);
            throw error; // O maneja este error según sea necesario para tu aplicación
        }
    }
}

export const mailMiddleWare = new MailMiddleWare();