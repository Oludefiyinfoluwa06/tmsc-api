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
import { GalleryGroupsService } from './gallery-groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Prisma } from '@prisma/client';

@Controller()
export class GalleryGroupsController {
  constructor(private readonly galleryGroupsService: GalleryGroupsService) {}

  // Public Endpoint
  @Get('gallery-groups')
  async getPublicGroups() {
    return this.galleryGroupsService.findAllPublic();
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Get('admin/gallery-groups')
  findAll() {
    return this.galleryGroupsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Post('admin/gallery-groups')
  create(@Body() data: Prisma.GalleryGroupCreateInput) {
    return this.galleryGroupsService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Get('admin/gallery-groups/:id')
  findOne(@Param('id') id: string) {
    return this.galleryGroupsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Put('admin/gallery-groups/:id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.GalleryGroupUpdateInput,
  ) {
    return this.galleryGroupsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Delete('admin/gallery-groups/:id')
  remove(@Param('id') id: string) {
    return this.galleryGroupsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Patch('admin/gallery-groups/reorder')
  reorder(@Body() items: { id: string; order: number }[]) {
    return this.galleryGroupsService.reorder(items);
  }
}
