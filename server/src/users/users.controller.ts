import { 
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, 
  Post, Put, Query, UseGuards, UploadedFile, UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { Users } from './entitie/users.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { ChangePasswordDto, ResetPasswordRequestDto, ResetPasswordConfirmDto } from './dto/changePassword.dto';
import { ChangeEmailRequestDto, ChangeEmailConfirmDto } from './dto/changeEmail.dto';
import { UpdatePreferencesDto } from './dto/updatePreferencesDto';
import { UserSearchDto } from './dto/userSearch.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from './roles.enum';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Supervisor, Role.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Omit<Users, 'password'>[]> {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const validatePage = pageNum > 0 && !isNaN(pageNum) ? pageNum : 1;
    const validateLimit = limitNum > 0 && !isNaN(limitNum) ? limitNum : 5;
    return await this.usersService.getAllUsers(validatePage, validateLimit);
  }

  @Get('search')
  @Roles(Role.Supervisor, Role.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserSearch(@Query() searchDto: UserSearchDto) {
    return await this.usersService.searchUsers(searchDto);
  }

  @Get('stats')
  @Roles(Role.Supervisor, Role.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserStats() {
    return await this.usersService.getUserStats();
  }

  @Get(':id')
  @Roles(Role.Supervisor, Role.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<Users, 'password'>> {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @Roles(Role.Supervisor, Role.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userNewData: UpdateUserDto,
  ): Promise<Omit<Users, 'password'>> {
    return await this.usersService.updateUser(id, userNewData);
  }

  @Delete('delete/:id')
  @Roles(Role.Supervisor)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Put('restore/:id')
  @Roles(Role.Supervisor)
  @UseGuards(AuthGuard, RolesGuard)
  async restoreUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.restoredUser(id);
  }

  @Get('profile/me')
  @UseGuards(AuthGuard)
  async getMeProfile(@GetUser() user: Users): Promise<Omit<Users, 'password'>> {
    return this.usersService.getUserById(user.id);
  }

  @Put('profile/me')
  @UseGuards(AuthGuard)
  async updateMeProfile(
    @GetUser() user: Users,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<Users, 'password'>> {
    return await this.usersService.updateUser(user.id, updateProfileDto);
  }

  @Patch('profile/password')
  @UseGuards(AuthGuard)
  async changePassword(
    @GetUser() user: Users,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Post('profile/email')
  @UseGuards(AuthGuard)
  async changeEmailRequest(
    @GetUser() user: Users,
    @Body() changeEmailDto: ChangeEmailRequestDto,
  ) {
    return await this.usersService.requestEmailChange(user.id, changeEmailDto);
  }

  @Post('profile/email/confirm')
  @UseGuards(AuthGuard)
  async changeEmailConfirm(
    @GetUser() user: Users,
    @Body() confirmDto: ChangeEmailConfirmDto,
  ) {
    return await this.usersService.confirmEmailChange(user.id, confirmDto);
  }

  @Post('profile/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @GetUser() user: Users,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.updateAvatar(user.id, file);
  }

  @Patch('profile/preferences')
  @UseGuards(AuthGuard)
  async updatePreferences(
    @GetUser() user: Users,
    @Body() preferencesDto: UpdatePreferencesDto,
  ) {
    return await this.usersService.updatePreferences(user.id, preferencesDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() resetRequestDto: ResetPasswordRequestDto,
  ) {
    return await this.usersService.requestPasswordReset(resetRequestDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetConfirmDto: ResetPasswordConfirmDto,
  ) {
    return await this.usersService.confirmPasswordReset(resetConfirmDto);
  }


  @Get('profile/:id')
  @Roles(Role.Supervisor, Role.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<Users, 'password'>> {
    return this.usersService.getUserById(id);
  }
}
