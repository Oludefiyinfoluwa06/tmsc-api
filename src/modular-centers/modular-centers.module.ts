import { Module } from '@nestjs/common';
import { ModularCentersService } from './modular-centers.service';
import { ModularCentersController } from './modular-centers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ModularCentersController],
  providers: [ModularCentersService],
  exports: [ModularCentersService],
})
export class ModularCentersModule {}
