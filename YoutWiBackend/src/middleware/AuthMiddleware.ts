import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

// Extender Request para incluir la propiedad user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Asume que el token viene en el formato "Bearer TOKEN"

    if (!token) return res.status(403).send({ error: "Token requerido" });

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(401).send({ error: "Token inválido" });

        // Decoded contiene los datos del usuario que fueron incluidos en el token
        req.user = decoded; // Ahora puedes acceder a req.user en tus controladores/rutas siguientes
        next();
    });
};
