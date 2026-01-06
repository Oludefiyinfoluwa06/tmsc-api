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
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService, UploadFolder } from '../upload/upload.service';
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
  constructor(
    private readonly service: ModularCentersService,
    private readonly uploadService: UploadService,
  ) {}

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, UploadService.getUploadPath(UploadFolder.MODULAR_CENTERS));
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  addImage(
    @Param('id') id: string,
    @Body() data: AddCenterImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file && !data.imageUrl) {
      throw new HttpException(
        'Image file or URL is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const imageUrl = file
      ? UploadService.getUploadUrl(UploadFolder.MODULAR_CENTERS, file.filename)
      : data.imageUrl;

    return this.service.addImage(id, {
      ...data,
      imageUrl,
    });
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
