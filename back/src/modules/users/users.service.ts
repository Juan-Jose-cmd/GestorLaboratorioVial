import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';
import { ObraRepository } from '../obras/obra.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppError } from '../../core/errors/app-error';

export class UsersService {
    private userRepository: UserRepository;
    private obraRepository: ObraRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.obraRepository = new ObraRepository();
    }

    async create(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        // Verificar si el email ya existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('El email ya está registrado', 400);
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword
        });

        // Eliminar password del retorno
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findAll() {
        const users = await this.userRepository.findAll();
        
        // Eliminar passwords de todos los usuarios
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    async findOne(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        // Si se está actualizando el email, verificar que no exista otro
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new AppError('El email ya está registrado', 400);
            }
        }

        // Si se está actualizando la contraseña, encriptarla
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updatedUser = await this.userRepository.update(id, updateUserDto);
        if (!updatedUser) {
            throw new AppError('Error al actualizar usuario', 500);
        }

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    async remove(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        // Soft delete
        await this.userRepository.softDelete(id);
        return { message: 'Usuario eliminado exitosamente' };
    }

    async getUsersByRol(rol: string) {
        const users = await this.userRepository.findByRol(rol as any);
        
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    async getDashboardStats() {
        const [laboratoristas, directores, jerarquicos] = await Promise.all([
            this.userRepository.countByRol('laboratorista'),
            this.userRepository.countByRol('director'),
            this.userRepository.countByRol('jerarquico')
        ]);

        const totalActivos = laboratoristas + directores + jerarquicos;

        return {
            totalActivos,
            porRol: {
                laboratoristas,
                directores,
                jerarquicos
            },
            porcentajes: {
                laboratoristas: Math.round((laboratoristas / totalActivos) * 100),
                directores: Math.round((directores / totalActivos) * 100),
                jerarquicos: Math.round((jerarquicos / totalActivos) * 100)
            }
        };
    }
}