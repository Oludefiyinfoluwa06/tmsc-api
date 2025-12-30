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
  Query,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Role, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // Public Endpoints
  @Get('gallery')
  getPublicGallery(@Query('groupId') groupId?: string) {
    return this.galleryService.findAllPublic(groupId);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Get('admin/gallery')
  getAdminGallery(@Query('groupId') groupId?: string) {
    return this.galleryService.findAllAdmin(groupId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Post('admin/gallery')
  create(
    @Body()
    data: Omit<Prisma.GalleryCreateInput, 'product' | 'group'> & {
      groupId?: string;
    },
  ) {
    const { groupId, ...rest } = data;

    const createData: Prisma.GalleryCreateInput = {
      ...rest,
    };

    if (groupId) {
      createData.group = { connect: { id: groupId } };
    }

    return this.galleryService.create(createData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Put('admin/gallery/:imageId')
  update(
    @Param('imageId') id: string,
    @Body()
    data: Omit<Prisma.GalleryUpdateInput, 'group'> & { groupId?: string },
  ) {
    const { groupId, ...rest } = data;

    const updateData: Prisma.GalleryUpdateInput = {
      ...rest,
    };

    if (groupId) {
      updateData.group = { connect: { id: groupId } };
    } else if (groupId === null) {
      updateData.group = { disconnect: true };
    }

    return this.galleryService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Delete('admin/gallery/:imageId')
  remove(@Param('imageId') id: string) {
    return this.galleryService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Patch('admin/gallery/reorder')
  reorder(@Body() items: { id: string; order: number }[]) {
    return this.galleryService.reorder(items);
  }
}
