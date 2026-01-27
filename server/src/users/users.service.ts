import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException,
  ConflictException 
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entitie/users.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { ChangePasswordDto, ResetPasswordRequestDto, ResetPasswordConfirmDto } from './dto/changePassword.dto';
import { ChangeEmailRequestDto, ChangeEmailConfirmDto } from './dto/changeEmail.dto';
import { UpdatePreferencesDto } from './dto/updatePreferencesDto';
import { UserSearchDto } from './dto/userSearch.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}

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

  async searchUsers(searchDto: UserSearchDto): Promise<Omit<Users, 'password'>[]> {
    return await this.usersRepository.searchUsers(searchDto);
  }

  async getUserStats(): Promise<any> {
    return await this.usersRepository.getUserStats();
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await this.usersRepository.getUserByIdWithPassword(userId);
    
    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword, 
      user.password
    );
    
    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Validar que la nueva contraseña sea diferente
    if (changePasswordDto.oldPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
    }

    // Validar confirmación de contraseña
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    
    await this.usersRepository.updatePassword(userId, hashedPassword);
    
    // Enviar notificación por email
    await this.mailService.sendPasswordChangedConfirmation(user.email);
    
    return { message: 'Contraseña actualizada exitosamente' };
  }

  async requestPasswordReset(resetRequestDto: ResetPasswordRequestDto): Promise<{ message: string }> {
    const user = await this.usersRepository.getUserByEmail(resetRequestDto.email);
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe
      return { message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña' };
    }

    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    await this.usersRepository.saveResetToken(user.id, resetToken, resetTokenExpiry);

    // Enviar email con el enlace de restablecimiento
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.mailService.sendPasswordResetEmail(user.email, resetLink);

    return { message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña' };
  }

  async confirmPasswordReset(resetConfirmDto: ResetPasswordConfirmDto): Promise<{ message: string }> {
    // Validar confirmación de contraseña
    if (resetConfirmDto.newPassword !== resetConfirmDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const user = await this.usersRepository.findByResetToken(resetConfirmDto.token);
    
    if (!user || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(resetConfirmDto.newPassword, 10);
    
    await this.usersRepository.updatePassword(user.id, hashedPassword);
    await this.usersRepository.clearResetToken(user.id);

    // Notificar al usuario
    await this.mailService.sendPasswordChangedConfirmation(user.email);

    return { message: 'Contraseña restablecida exitosamente' };
  }

  async requestEmailChange(userId: string, changeEmailDto: ChangeEmailRequestDto): Promise<{ message: string }> {
    // Verificar que el usuario existe y obtener contraseña
    const user = await this.usersRepository.getUserByIdWithPassword(userId);
    
    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      changeEmailDto.password, 
      user.password
    );
    
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    // Verificar que el nuevo email no esté en uso
    const existingUser = await this.usersRepository.getUserByEmail(changeEmailDto.newEmail);
    if (existingUser) {
      throw new ConflictException('El nuevo email ya está en uso');
    }

    // Generar token de confirmación
    const emailChangeToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); 

    await this.usersRepository.saveEmailChangeToken(
      userId, 
      changeEmailDto.newEmail, 
      emailChangeToken, 
      tokenExpiry
    );

    // Enviar email de confirmación al nuevo email
    const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?token=${emailChangeToken}`;
    await this.mailService.sendEmailChangeConfirmation(
      changeEmailDto.newEmail, 
      confirmationLink
    );

    return { message: 'Se ha enviado un email de confirmación a la nueva dirección' };
  }

  async confirmEmailChange(userId: string, confirmDto: ChangeEmailConfirmDto): Promise<{ message: string }> {
    const result = await this.usersRepository.confirmEmailChange(userId, confirmDto.token);
    
    if (!result) {
      throw new BadRequestException('Token inválido o expirado');
    }

    return { message: 'Email actualizado exitosamente' };
  }

  async updateAvatar(userId: string, file: Express.Multer.File): Promise<{ avatarUrl: string }> {
    // Validar archivo
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    // Validar tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato de imagen no válido. Use JPEG, PNG, GIF o WebP');
    }

    // Validar tamaño 
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('La imagen es demasiado grande. Máximo 5MB');
    }

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;
    
    // Aquí implementarías la lógica para guardar el archivo
    const avatarUrl = await this.saveAvatarFile(file, fileName);

    // Actualizar en la base de datos
    await this.usersRepository.updateAvatar(userId, avatarUrl);

    return { avatarUrl };
  }

  private async saveAvatarFile(file: Express.Multer.File, fileName: string): Promise<string> {
    // Implementación básica para almacenamiento local
    const fs = require('fs').promises;
    const path = require('path');
    
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    
    // Crear directorio si no existe
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);

    // Retornar URL relativa
    return `/uploads/avatars/${fileName}`;
  }

  async updatePreferences(userId: string, preferencesDto: UpdatePreferencesDto): Promise<Omit<Users, 'password'>> {
    return await this.usersRepository.updatePreferences(userId, preferencesDto);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Omit<Users, 'password'>> {
    return await this.usersRepository.updateProfile(userId, updateProfileDto);
  }
}