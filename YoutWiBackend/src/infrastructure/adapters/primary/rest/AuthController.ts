// src/controllers/UserController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/config';
import {User} from "../../../../domain/models/User";
import {myContainer} from "../../../config/inversify.config";
import {UserDomainService} from "../../../../domain/services/userDomainService";
import {TYPES} from "../../../config/types";
import { v4 as uuidv4 } from 'uuid';
import {mailMiddleWare} from "../../../../middleware/MailMiddleWare";
import {inject, injectable} from "inversify";
import {IUserDomainService} from "../../../../domain/port/IUserDomainService";
import {OAuth2Client} from 'google-auth-library';

@injectable()
class AuthController {

    // Función de registro
    constructor(
        @inject(TYPES.IUserDomainService) private service: IUserDomainService
    ) {}

    /**
     * @openai
     * @param req
     * @param res
     */
    public register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { username, password, email } = req.body;

            // Cifrar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            // crear una uid aleotoria
            const uid = uuidv4();

            // Crear el usuario (aquí deberías guardar el usuario en tu DB)
            const newUser = new User();
            newUser.setUsername = username;
            newUser.setPassword = hashedPassword;
            newUser.setEmail = email;
            console.log(email)
            newUser.setUid = uid;
            // Guardar newUser en la base de datos
            // const savedUser = await userRepository.save(newUser);
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

    // Función de login
    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { username, password } = req.body;

            // Aquí deberías buscar el usuario en tu base de datos
            // const user = await userRepository.findOne({ username });
            const user = await this.service.findByUsername(username);

            if(!user?.getActive){
                return res.status(400).json({ error: "Usuario no activo" });
            }

            // Verificar la contraseña
            if (user && await bcrypt.compare(password, user.getPassword)) {
                // Generar token JWT
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
        const { token } = req.params; // Asume que el token se envía como parte de la URL

        try {
            const user = await this.service.findByUid(token);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado o token inválido.' });
            }

            user.setActive = true;
            await this.service.save(user);

            return res.status(200).json({ message: 'Cuenta verificada con éxito.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al verificar la cuenta.' });
        }
    }

    public async googleAuthCallback (req: Request, res: Response): Promise<Response> {
        // El usuario ya debería estar autenticado por Google y procesado por Passport a este punto
        // Passport automáticamente adjunta el usuario al objeto req
        const user = req.user;
        console.log("login con google" + user);

        if (!user) {
            return res.status(401).json({ message: 'Error en la autenticación de Google.' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    };


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
            audience: process.env.GOOGLE_CLIENT_ID,  // Especifica el CLIENT_ID de tu app
        });
        const payload = ticket.getPayload();
        console.log(payload);

        return payload;
    }

}


export default AuthController;
