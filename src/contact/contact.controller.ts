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
import { ContactService } from './contact.service';
import { Status, Role, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  submit(@Body() data: Prisma.ContactCreateInput) {
    return this.contactService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin')
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Status) {
    return this.contactService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
