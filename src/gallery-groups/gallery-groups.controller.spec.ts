import { Test, TestingModule } from '@nestjs/testing';
import { GalleryGroupsController } from './gallery-groups.controller';

describe('GalleryGroupsController', () => {
  let controller: GalleryGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryGroupsController],
    }).compile();

    controller = module.get<GalleryGroupsController>(GalleryGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
