import { 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
  BadRequestException 
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entitie/users.entity";
import { 
  Repository, 
  Like, 
  Between, 
  MoreThanOrEqual, 
  LessThanOrEqual, 
  ILike,
  FindOptionsWhere,
  FindManyOptions 
} from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UpdateProfileDto } from "./dto/updateProfile.dto";
import { UpdatePreferencesDto } from "./dto/updatePreferencesDto";
import { UserSearchDto } from "./dto/userSearch.dto";
import * as bcrypt from 'bcrypt';
import { Role } from "./roles.enum";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private ormUserRepository: Repository<Users>
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<Users, 'password'>[]> {
    const skip = (page - 1) * limit;
    const allUsers = await this.ormUserRepository.find({
      skip: skip,
      take: limit,
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'phone', 'site', 'role', 'isActive', 'avatarUrl', 'createdAt', 'updatedAt']
    });

    return allUsers;
  }

  async getUserById(id: string): Promise<Omit<Users, 'password'>> {
    const foundUser = await this.ormUserRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'site', 'role', 'isActive', 'avatarUrl', 'createdAt', 'updatedAt', 'preferences', 'isExternal']
    });

    if (!foundUser) throw new NotFoundException(`No se encontró el usuario con id: ${id}`);

    return foundUser;
  }

  async getUserByIdWithPassword(id: string): Promise<Users> {
    const foundUser = await this.ormUserRepository.findOne({
      where: { id, isActive: true },
    });

    if (!foundUser) throw new NotFoundException(`No se encontró el usuario activo con id: ${id}`);

    return foundUser;
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.ormUserRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async addUser(newUserData: CreateUserDto): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    
    const user = this.ormUserRepository.create({
      name: newUserData.name,
      email: newUserData.email,
      password: hashedPassword,
      phone: newUserData.phone,
      site: newUserData.site,
      role: newUserData.role || Role.Laboratorist, // Usa el enum aquí
      isExternal: newUserData.isExternal || false,
      isActive: newUserData.isActive !== undefined ? newUserData.isActive : true,
    });

    const savedUser = await this.ormUserRepository.save(user);
    return savedUser.id;
  } catch (error) {
      if (error.code === '23505') {
        throw new InternalServerErrorException('El email ya está registrado');
      }
      throw new InternalServerErrorException('Error al crear usuario: ' + error.message);
    }
  }

  async updateUser(id: string, newUserData: UpdateUserDto): Promise<Omit<Users, 'password'>> {
    const user = await this.ormUserRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) throw new NotFoundException(`No existe usuario activo con id: ${id}`);

    // Si se está actualizando la contraseña, encriptarla
    if (newUserData.password) {
      newUserData.password = await bcrypt.hash(newUserData.password, 10);
    }

    const mergedUser = this.ormUserRepository.merge(user, newUserData);
    const savedUser = await this.ormUserRepository.save(mergedUser);
    
    const { password, ...userNoPassword } = savedUser;
    return userNoPassword;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<Omit<Users, 'password'>> {
    const user = await this.ormUserRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) throw new NotFoundException(`No existe usuario activo con id: ${id}`);

    const mergedUser = this.ormUserRepository.merge(user, updateProfileDto);
    const savedUser = await this.ormUserRepository.save(mergedUser);
    
    const { password, ...userNoPassword } = savedUser;
    return userNoPassword;
  }

  async deleteUser(id: string): Promise<Omit<Users, 'password'>> {
    const foundUser = await this.ormUserRepository.findOneBy({ id });

    if (!foundUser) throw new NotFoundException(`No existe usuario con id ${id}`);

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

  async searchUsers(searchDto: UserSearchDto): Promise<Omit<Users, 'password'>[]> {
    const { 
      q, 
      role, 
      site, 
      isActive, 
      desde, 
      hasta, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = searchDto;
    
    const skip = (page - 1) * limit;
    const whereConditions: FindOptionsWhere<Users> = {};

    // Busqueda general
    if (q) {
      whereConditions.name = ILike(`%${q}%`);
    }

    // Filtros específicos
    if (role) {
      whereConditions.role = role;
    }

    if (site) {
      whereConditions.site = ILike(`%${site}%`);
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    // Filtro por fecha
    if (desde || hasta) {
      const dateFilter: any = {};
      if (desde) {
        dateFilter.createdAt = MoreThanOrEqual(new Date(desde));
      }
      if (hasta) {
        dateFilter.createdAt = LessThanOrEqual(new Date(hasta));
      }
      Object.assign(whereConditions, dateFilter);
    }

    const options: FindManyOptions<Users> = {
      where: whereConditions,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      select: ['id', 'name', 'email', 'phone', 'site', 'role', 'isActive', 'avatarUrl', 'createdAt', 'updatedAt']
    };

    const users = await this.ormUserRepository.find(options);
    return users;
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.ormUserRepository.count();
    const activeUsers = await this.ormUserRepository.count({ where: { isActive: true } });
    const inactiveUsers = totalUsers - activeUsers;

    // Contar por rol
    const roleCounts = await this.ormUserRepository
      .createQueryBuilder('user')
      .select('user.role, COUNT(*) as count')
      .groupBy('user.role')
      .getRawMany();

    // Usuarios por fecha 
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await this.ormUserRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :date', { date: thirtyDaysAgo })
      .getCount();

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole: roleCounts,
      recentRegistrations: recentUsers,
    };
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.ormUserRepository.update(id, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  }

  async saveResetToken(id: string, resetToken: string, expiry: Date): Promise<void> {
    await this.ormUserRepository.update(id, {
      resetToken,
      resetTokenExpiry: expiry,
      updatedAt: new Date(),
    });
  }

  async findByResetToken(token: string): Promise<Users | null> {
    return await this.ormUserRepository.findOne({
      where: { 
        resetToken: token,
        resetTokenExpiry: MoreThanOrEqual(new Date()),
        isActive: true,
      },
    });
  }

  async clearResetToken(id: string): Promise<void> {
  await this.ormUserRepository.update(id, {
    resetToken: null as any,
    resetTokenExpiry: null as any,
    updatedAt: new Date(),
  });
}

  async saveEmailChangeToken(
    userId: string, 
    newEmail: string, 
    token: string, 
    expiry: Date
  ): Promise<void> {
    await this.ormUserRepository.update(userId, {
      pendingEmail: newEmail,
      emailChangeToken: token,
      emailChangeTokenExpiry: expiry,
      updatedAt: new Date(),
    });
  }

  async confirmEmailChange(userId: string, token: string): Promise<boolean> {
  const user = await this.ormUserRepository.findOne({
    where: {
      id: userId,
      emailChangeToken: token,
      emailChangeTokenExpiry: MoreThanOrEqual(new Date()),
      isActive: true,
    },
  });

  if (!user || !user.pendingEmail) {
    return false;
  }

  // Actualizar email
  await this.ormUserRepository.update(userId, {
    email: user.pendingEmail,
    pendingEmail: null as any,
    emailChangeToken: null as any,
    emailChangeTokenExpiry: null as any,
    updatedAt: new Date(),
  });

  return true;
}

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    await this.ormUserRepository.update(userId, {
      avatarUrl,
      updatedAt: new Date(),
    });
  }

  async updatePreferences(userId: string, preferencesDto: UpdatePreferencesDto): Promise<Omit<Users, 'password'>> {
    const user = await this.ormUserRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado o inactivo`);
    }

    // Actualizar preferencias
    user.preferences = {
      ...user.preferences,
      ...preferencesDto,
    };
    user.updatedAt = new Date();

    const savedUser = await this.ormUserRepository.save(user);
    const { password, ...userNoPassword } = savedUser;

    return userNoPassword;
  }
}