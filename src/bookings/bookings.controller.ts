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
import { BookingsService } from './bookings.service';
import { Status, Role, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  book(@Body() data: Prisma.BookingCreateInput) {
    if (data.preferredDate) {
      data.preferredDate = new Date(data.preferredDate);
    }
    return this.bookingsService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin')
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Status) {
    return this.bookingsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
