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
import { ModularCentersService } from './modular-centers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreateModularCenterDto,
  UpdateModularCenterDto,
  AddCenterImageDto,
  UpdateCenterImageDto,
  ReorderItemsDto,
} from './modular-centers.dto';

@Controller()
export class ModularCentersController {
  constructor(private readonly service: ModularCentersService) {}

  // Public Endpoints
  @Get('modular-centers')
  findAllPublic() {
    return this.service.findAllPublic();
  }

  @Get('modular-centers/:id')
  findOnePublic(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Admin Endpoints - Centers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Get('admin/modular-centers')
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Post('admin/modular-centers')
  create(@Body() data: CreateModularCenterDto) {
    return this.service.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Get('admin/modular-centers/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Put('admin/modular-centers/:id')
  update(@Param('id') id: string, @Body() data: UpdateModularCenterDto) {
    return this.service.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Delete('admin/modular-centers/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Patch('admin/modular-centers/reorder')
  reorder(@Body() data: ReorderItemsDto) {
    return this.service.reorder(data.ids);
  }

  // Admin Endpoints - Images
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Post('admin/modular-centers/:id/images')
  addImage(@Param('id') id: string, @Body() data: AddCenterImageDto) {
    return this.service.addImage(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Put('admin/modular-centers/images/:imageId')
  updateImage(
    @Param('imageId') imageId: string,
    @Body() data: UpdateCenterImageDto,
  ) {
    return this.service.updateImage(imageId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Delete('admin/modular-centers/images/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.service.removeImage(imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.MODULAR_CENTERS_ADMIN)
  @Patch('admin/modular-centers/:id/images/reorder')
  reorderImages(@Param('id') id: string, @Body() data: ReorderItemsDto) {
    return this.service.reorderImages(id, data.ids);
  }
}
