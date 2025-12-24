import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MandatesService } from './mandates.service';
import { Status, Role, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('mandates')
export class MandatesController {
  constructor(private readonly mandatesService: MandatesService) {}

  @Post()
  submit(@Body() data: Prisma.MandateCreateInput) {
    return this.mandatesService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin')
  findAll() {
    return this.mandatesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.mandatesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Status) {
    return this.mandatesService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.mandatesService.remove(id);
  }
}
