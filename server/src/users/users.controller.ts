import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entitie/users.entity';
import { UpdateUserDto } from './dto/createUser.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from './roles.enum';

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
    return await this.usersService.getAllUsers(validatePage, validateLimit)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
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
}
