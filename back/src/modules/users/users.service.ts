import bcrypt from 'bcrypt';
import { AppDataSource } from '../../infra/db/data-source';
import { Usuario } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { validate } from 'class-validator';

export class UserService {
    private userRepository = AppDataSource.getRepository(Usuario);
    
    async getAllUsersService() {
        const users = await this.userRepository.find(
            {relations: ['obrasDirigidas'] }
        );
        return users.map(user => {
            const { passwordHash, resetPasswordToken, ...userWithoutSensitiveData } = user;
            return userWithoutSensitiveData;
        });
    }

    async getUserbyIdService(id: string) {
        const foundUser = await this.userRepository.findOne({
            where: { id },
            relations: ['obrasDirigidas', 'solicitudesCreadas'] 
        });

        if (!foundUser) {
            throw new Error('Usuario no encontrado');
        }

        const { passwordHash, resetPasswordToken, ...userWithoutSensitiveData } = foundUser;
        return userWithoutSensitiveData;
    }

    async createUser(userData: CreateUserDto) {
        const errors = await validate(userData);
            if (errors.length > 0) {
                throw new Error(`Datos inválidos: ${errors.map(e => e.property).join(', ')}`);
            }
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('El usuario con este email ya existe');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = this.userRepository.create({
            nombreCompleto: userData.nombreCompleto, 
            email: userData.email,
            passwordHash: hashedPassword,
            rol: userData.rol,
            esActivo: true
        });

        await this.userRepository.save(user);

        const { passwordHash, resetPasswordToken, ...userWithoutSensitiveData } = user;
        return userWithoutSensitiveData;
    }

    async loginUserService(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'passwordHash', 'nombreCompleto', 'rol', 'esActivo']
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (!user.esActivo) {
            throw new Error('Usuario desactivado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }

        const token = AuthService.generateToken(user);

        const { passwordHash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token: token
        };
    }
};
