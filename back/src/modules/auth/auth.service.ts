import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { JwtConfig } from '../../infra/db/jwt.config';
import { Usuario } from '../users/user.entity';

export interface TokenPayload extends JwtPayload {
    id: string;
    email: string;
    rol: string;
    nombre: string;
    iat?: number;
    exp?: number;
}

export interface UserTokenData {
    id: string;
    email: string;
    rol: string;
    nombre: string;
}

export class AuthService {
    private static jwtConfig = JwtConfig.getInstance();

    private static extractUserTokenData(user: Usuario): UserTokenData {
        return {
            id: user.id,
            email: user.email,
            rol: user.rol,
            nombre: user.nombreCompleto
        };
    }

    static generateToken(user: Usuario): string {
        const payload: TokenPayload = this.extractUserTokenData(user);
        
        return jwt.sign(
            payload, 
            this.jwtConfig.secret, 
            { expiresIn: this.jwtConfig.expiresIn } as SignOptions
        );
    }

    static verifyToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.jwtConfig.secret);
            return decoded as TokenPayload;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido');
            }
            if (error.name === 'NotBeforeError') {
                throw new Error('Token no activo aún');
            }
            throw new Error('Error verificando token');
        }
    }

    static decodeToken(token: string): TokenPayload | null {
        try {
            return jwt.decode(token) as TokenPayload;
        } catch {
            return null;
        }
    }

    static refreshToken(oldToken: string): string | null {
        try {
            const decoded = this.decodeToken(oldToken);
            if (!decoded) return null;

            const newPayload: TokenPayload = {
                id: decoded.id,
                email: decoded.email,
                rol: decoded.rol,
                nombre: decoded.nombre
            };

            return jwt.sign(
                newPayload, 
                this.jwtConfig.secret, 
                { expiresIn: this.jwtConfig.expiresIn } as SignOptions
            );
        } catch {
            return null;
        }
    }

    static hasRole(token: string, requiredRole: string): boolean {
        try {
            const decoded = this.verifyToken(token);
            return decoded.rol === requiredRole;
        } catch {
            return false;
        }
    }

    static getUserIdFromToken(token: string): string | null {
        try {
            const decoded = this.verifyToken(token);
            return decoded.id;
        } catch {
            return null;
        }
    }
}