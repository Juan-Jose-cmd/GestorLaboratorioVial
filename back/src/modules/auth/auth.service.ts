import jwt from 'jsonwebtoken';
import { JwtConfig } from '../../infra/db/jwt.config';
import { Usuario } from '../users/user.entity';

export class AuthService {
    private static jwtConfig = JwtConfig.getInstance();

    static generateToken(user: Usuario): string {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                rol: user.rol,
                nombre: user.nombreCompleto
            },
            this.jwtConfig.secret,
            { expiresIn: this.jwtConfig.expiresIn } as any
        );
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtConfig.secret);
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido');
            }
            throw new Error('Error verificando token');
        }
    }
}