import {query, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/config';
import {User} from "../../../../domain/models/User";
import {myContainer} from "../../../config/inversify.config";
import {UserDomainService} from "../../../../domain/services/UserDomainService";
import {Types} from "../../../config/Types";
import { v4 as uuidv4 } from 'uuid';
import {mailMiddleWare} from "../../../../middleware/MailMiddleWare";
import {inject, injectable} from "inversify";
import {IUserDomainService} from "../../../../domain/port/primary/IUserDomainService";
import {OAuth2Client} from 'google-auth-library';
import axios from 'axios';
import {IBroadcasterDomainService} from "../../../../domain/port/primary/IBroadcasterDomainService";
import {Broadcaster} from "../../../../domain/models/Broadcaster";

@injectable()
class AuthController {

    // Función de registro
    constructor(
        @inject(Types.IUserDomainService) private service: IUserDomainService,
        @inject(Types.IBroadcasterDomainService) private broadcasterDomainService: IBroadcasterDomainService
    ) {}



    public register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { username, password, email } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const uid = uuidv4();

            const newUser = new User();
            newUser.setUsername = username;
            newUser.setPassword = hashedPassword;
            newUser.setEmail = email;
            console.log(email)
            newUser.setUid = uid;
            try {
                await mailMiddleWare.sendAccountConfirmationEmail(email, uid);
                let usuarioRegistrado = await this.service.register(newUser);

            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al enviar email de confirmación. Cuenta no creada" });
            }

            return res.status(201).json({ message: "Usuario registrado exitosamente" });
        } catch (error) {
            return res.status(500).json({ error: "Error en el servidor" });
        }
    };


    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { username, password } = req.body;
            console.log(username, password)

            const user = await this.service.findByUsername(username);

            if(!user?.getActive){
                return res.status(400).json({ error: "Usuario no activo" });
            }

            if (user && await bcrypt.compare(password, user.getPassword)) {
                const token = jwt.sign({ userId: user.getId, username: user.getUsername, role: user.getRole }, JWT_SECRET, { expiresIn: '7d' });
                console.log("Login exitoso" + token);
                return res.json({ message: "Login exitoso", token });
            }

            return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
        } catch (error: any) {
            return res.status(500).json({ error: "Error en el servidor\n"+error.message });
        }
    };


    public async verifyAccount(req: Request, res: Response): Promise<Response> {
        const { uid } = req.params;
        

        try {
            const user = await this.service.findByUid(uid);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado o token inválido.' });
            }

            console.log(JSON.stringify(user));

            await this.service.updateActive(user.getId, true);

            return res.status(200).json({ message: 'Cuenta verificada con éxito.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al verificar la cuenta.' });
        }
    }

    public async googleAuth (req: Request, res: Response) {
        {
            const { token } = req.body;

            try {
                const payload = await this.verifyToken(token);

                if (!payload) {
                    return res.status(401).json({ message: 'Autenticación fallida' });
                }


                let findByEmail = await this.service.findByEmail(payload.email??"noexiste");
                if(findByEmail != null) {
                    if (findByEmail.getGoogleId == null) {
                        return res.status(401).json({message: 'El email ya está registrado'});
                    } else {
                        const jwtToken = jwt.sign(
                            {
                                userId: findByEmail?.getId,
                                username: findByEmail?.getUsername,
                                role: findByEmail?.getRole
                            },
                            process.env.JWT_SECRET || 'your_secret_key',
                            {expiresIn: '7d'}
                        );
                        res.json({message: 'Autenticación exitosa', token: jwtToken});


                    }
                }else {


                    let user: User | null = new User();
                    user.setEmail = payload.email ?? "";
                    user.setUsername = payload.name ?? "";
                    user.setGoogleId = token;
                    user.setUid = uuidv4();
                    user.setPassword = uuidv4();
                    user.setActive = true;
                    user = await this.service.findByGoogleIdOrCreate(token, user);

                    console.log(user);

                    if (user) {
                        const jwtToken = jwt.sign(
                            {
                                userId: user?.getId,
                                username: user?.getUsername,
                                role: user?.getRole
                            },
                            process.env.JWT_SECRET || 'your_secret_key',
                            {expiresIn: '7d'}
                        );


                        res.json({message: 'Autenticación exitosa', token: jwtToken});
                    } else {
                        res.status(401).json({message: 'Autenticación fallida'});
                    }
                }
            } catch (error) {
                console.error('Error verificando el token de Google:', error);
                res.status(401).json({ message: 'Autenticación fallida' });
            }
        }
    };


    private async verifyToken(idToken: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(payload);

        return payload;
    }


    public twitchAuth = async (req: Request, res: Response) => {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        const redirectUri = 'https://youtwi.live/api/auth/twitch/callback';
        

        const { code } = req.query;


        try {
            const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
                params: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                }
            });

            const accessToken = tokenResponse.data.access_token;

            const customUrlScheme = `youtwi://callback`;
            return res.redirect(customUrlScheme);
        } catch (error) {
            console.error('Error en el proceso de autenticación de Twitch:', error);
            res.status(500).send('Error interno del servidor');
        }
    };

    public adminLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;

        const user = await this.service.findByUsername(username);

        if (!user || user.getRole !== 'ROLE_ADMIN') {
            return res.status(401).json({ error: "Acceso denegado" });
        }

        if (await bcrypt.compare(password, user.getPassword)) {
            const token = jwt.sign(
                { userId: user.getId, username: user.getUsername, role: user.getRole },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            return res.json({ message: "Inicio de sesión de administrador exitoso", token });
        } else {
            return res.status(400).json({ error: "Nombre de usuario o contraseña inválidos" });
        }
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
};


}


export default AuthController;
