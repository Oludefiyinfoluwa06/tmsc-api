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
import { ProductType, Role, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // Public Endpoints
  @Get('gallery/:productType')
  getPublicGallery(
    @Param('productType') productType: string,
    @Query('groupId') groupId?: string,
  ) {
    const type = productType.toUpperCase().replace('-', '_') as ProductType;
    return this.galleryService.findAllPublic(type, groupId);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Get('admin/gallery/:productType')
  getAdminGallery(
    @Param('productType') productType: string,
    @Query('groupId') groupId?: string,
  ) {
    const type = productType.toUpperCase().replace('-', '_') as ProductType;
    return this.galleryService.findAllAdmin(type, groupId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GALLERY_ADMIN)
  @Post('admin/gallery/:productType')
  create(
    @Param('productType') productType: string,
    @Body()
    data: Omit<Prisma.GalleryCreateInput, 'productType' | 'group'> & {
      groupId?: string;
    },
  ) {
    const type = productType.toUpperCase().replace('-', '_') as ProductType;
    const { groupId, ...rest } = data;

    const createData: Prisma.GalleryCreateInput = {
      ...rest,
      productType: type,
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
