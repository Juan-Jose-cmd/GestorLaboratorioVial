import dotenv from 'dotenv';

dotenv.config();

export class JwtConfig {
    private static instance: JwtConfig;
    
    public readonly secret: string;
    public readonly expiresIn: string; // Solo string

    private constructor() {
        const envSecret = process.env.JWT_SECRET;
        const envExpiresIn = process.env.JWT_EXPIRES_IN;

        if (!envSecret && process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET es requerido en producción');
        }

        this.secret = envSecret || 'dev_secret_change_in_production_12345';
        
       
        let expiresIn = envExpiresIn || '24h';
        
       
        if (expiresIn && !isNaN(Number(expiresIn))) {
            expiresIn = expiresIn + 's'; 
        }
        
        this.expiresIn = expiresIn;

        // Log
        if (process.env.NODE_ENV !== 'production') {
            console.log(`JWT Config: expiresIn="${this.expiresIn}"`);
        }
    }

    public static getInstance(): JwtConfig {
        if (!JwtConfig.instance) {
            JwtConfig.instance = new JwtConfig();
        }
        return JwtConfig.instance;
    }
}