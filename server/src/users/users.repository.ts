import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entitie/users.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto/users.dto";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(Users) private ormUserRepository: Repository<Users>
    ) {}

    async getAllUsers(
        page: number,
        limit: number,): Promise<Omit<Users, 'password'>[]> {
    const skip = (page - 1) * limit;
    const allUsers = await this.ormUserRepository.find({
      skip: skip,
      take: limit,
      where: { isActive: true },
    });

    return allUsers.map(({ password, ...userNoPassword }) => userNoPassword); 
    }

    async getUserById(id: string): Promise<Omit<Users, 'password'>> {
        const foundUser = await this.ormUserRepository.findOne({
            where: { id },
        })

        if (!foundUser) throw new NotFoundException(`No se encontro el usuario con id: ${id}`);

        const { password, ...userNoPassword } = foundUser;

        return userNoPassword;
    }

    async getUserByEmail(email: string): Promise<Users | null> {
        return await this.ormUserRepository.findOneBy({ email, isActive: true  });
    } 

    async addUser(newUserData: CreateUserDto): Promise<string> {
        try {
            const user = await this.ormUserRepository.create({
            name: newUserData.name,
            email: newUserData.email,
            password: newUserData.password,
            phone: newUserData.phone,
            site: newUserData.site,
            role: newUserData.role,
            isActive: true,
        });

            const savedUser = await this.ormUserRepository.save(user);
            return savedUser.id;
        } catch (error) {
            if (error.code === '23505') {
                throw new InternalServerErrorException('El email ya está registrado');
            }
            throw error;
        }
    }

    async updateUser(id: string, newUserData: UpdateUserDto): Promise<Omit<Users, 'password'>> {
        
        const user = await this.ormUserRepository.findOneBy({ id, isActive: true });

        if (!user) throw new NotFoundException(`No existe usuario activo con id: ${id}`);

        const mergedUser = this.ormUserRepository.merge(user, newUserData);
        const savedUser = await this.ormUserRepository.save(mergedUser);
        const { password, ...userNoPassword } = savedUser;

        return userNoPassword;
    }

    async deleteUser(id: string): Promise<Omit<Users, 'password'>> {

        const foundUser = await this.ormUserRepository.findOneBy({ id });

        if (!foundUser) throw new Error(`No existe usuario con id ${id}`);

        if (!foundUser.isActive) {
            throw new InternalServerErrorException(`El usuario con id ${id} ya está inactivo`);
        }

        foundUser.isActive = false;
        foundUser.updatedAt = new Date();

        const savedUser = await this.ormUserRepository.save(foundUser);
        const { password, ...userNoPassword } = savedUser;

        return userNoPassword;
    }

    async restoredUser(id: string): Promise<Omit<Users, 'password'>> {
        
        const foundUser = await this.ormUserRepository.findOneBy({ id });

        if (!foundUser) {
            throw new NotFoundException(`No existe usuario con id: ${id}`);
        }

        if (foundUser.isActive) {
            throw new InternalServerErrorException(`El usuario con id ${id} ya está activo`);
        }

        foundUser.isActive = true;
        foundUser.updatedAt = new Date();

        const savedUser = await this.ormUserRepository.save(foundUser);
        const { password, ...userNoPassword } = savedUser;

        return userNoPassword;
    }
}