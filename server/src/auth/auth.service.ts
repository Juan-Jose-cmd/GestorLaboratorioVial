import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    async singIn(email: string, password: string) {
        const foundUser = await this.userRepository.getUserByEmail(email);

        if (!foundUser) throw new UnauthorizedException('Email o password incorrectos');

        const validPassword = await bcrypt.compare(password, foundUser.password);

        if (!validPassword) throw new UnauthorizedException('Email o password incorrectos');

        const payload = {
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role,
        };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Usuario logueado',
            token: token,
        };
    }

    async singUp(newUserData: CreateUserDto) {
        const { email, password } = newUserData;

        const foundUser = await this.userRepository.getUserByEmail(email);
        if (foundUser) throw new BadRequestException('Email ya se encuentra registrado');

        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.userRepository.addUser({
            ...newUserData,
            password: hashedPassword,
        });
    }
}
