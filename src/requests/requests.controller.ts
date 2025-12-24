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
import { RequestsService } from './requests.service';
import { Status, Role, RequestType, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('concept-pack')
  requestConceptPack(@Body() data: Omit<Prisma.RequestCreateInput, 'type'>) {
    return this.requestsService.create({
      ...data,
      type: RequestType.CONCEPT_PACK,
    });
  }

  @Post('titanium-pack')
  requestTitaniumPack(@Body() data: Omit<Prisma.RequestCreateInput, 'type'>) {
    return this.requestsService.create({
      ...data,
      type: RequestType.TITANIUM_PACK,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin')
  findAll() {
    return this.requestsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Status) {
    return this.requestsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.CONTACTS_ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }
}
