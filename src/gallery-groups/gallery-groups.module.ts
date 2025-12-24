import { Module } from '@nestjs/common';
import { GalleryGroupsService } from './gallery-groups.service';
import { GalleryGroupsController } from './gallery-groups.controller';

@Module({
  providers: [GalleryGroupsService],
  controllers: [GalleryGroupsController]
})
export class GalleryGroupsModule {}
