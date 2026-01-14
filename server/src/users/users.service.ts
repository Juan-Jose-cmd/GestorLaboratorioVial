import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entitie/users.entity';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async getAllUsers(
        page: number,
        limit: number,
    ): Promise<Omit<Users, 'password'>[]> {
        return await this.usersRepository.getAllUsers(page, limit);
    }

    async getUserById(id: string): Promise<Omit<Users, 'password'>> {
        return await this.usersRepository.getUserById(id);
    }

    async updateUser(id: string, newUserData: UpdateUserDto): Promise<Omit<Users, 'password'>> {
        return await this.usersRepository.updateUser(id, newUserData);
    }

    async deleteUser(id: string): Promise<Omit<Users, 'password'>> {
        return this.usersRepository.deleteUser(id);
    }

    async restoredUser(id: string): Promise<Omit<Users, 'password'>> {
        return this.usersRepository.restoredUser(id);
    }
}
