export class JwtConfig {
    private static instance: JwtConfig;
    public readonly secret: string;
    public readonly expiresIn: string;

    private constructor() {
        const envSecret = process.env.JWT_SECRET;
        
        this.secret = envSecret || 'default_dev_secret_change_in_production';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    public static getInstance(): JwtConfig {
        if (!JwtConfig.instance) {
            JwtConfig.instance = new JwtConfig();
        }
        return JwtConfig.instance;
    }
}