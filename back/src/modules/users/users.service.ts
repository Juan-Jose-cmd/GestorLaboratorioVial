import bcrypt from 'bcrypt';
import { AppDataSource } from '../../infra/db/data-source';
import { Usuario } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export class UserService {
    private userRepository = AppDataSource.getRepository(Usuario); 

    async createUser(userData: CreateUserDto){
        const existingUser = await this.userRepository.findOne({
            where: {
                email: userData.email
            }
        });

        if (existingUser) {
            throw new Error('El usuario con este email ya existe');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }
}
