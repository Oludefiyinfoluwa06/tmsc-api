import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.update(id, { role });
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
