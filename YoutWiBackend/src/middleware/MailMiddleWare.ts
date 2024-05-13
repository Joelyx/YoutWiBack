import nodemailer, { Transporter } from 'nodemailer';

class MailMiddleWare {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: "joelhernandezmartin01@gmail.com",
                pass: "tyze hdxq ptvv xydi",
            },
        });
    }

    async sendAccountConfirmationEmail(to: string, token: string): Promise<void> {
        const mailOptions = {
            from: `"YoutWi" <${process.env.SMTP_FROM}>`, // email del remitente
            to: to,
            subject: "Confirma tu Cuenta",
            text: `Por favor confirma tu cuenta haciendo clic en este enlace: https://back.youtwi.live/api/auth/confirm/${token}`,
            html: `<b>Por favor confirma tu cuenta haciendo clic en este enlace:</b> <a href="https://back.youtwi.live/api/auth/confirm/${token}">Confirmar Cuenta</a>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email de confirmación enviado a ${to}`);
        } catch (error) {
            console.error(`Error al enviar email a ${to}: `, error);
            throw error;
        }
    }
}

export const mailMiddleWare = new MailMiddleWare();