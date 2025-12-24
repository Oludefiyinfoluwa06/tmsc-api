import { Test, TestingModule } from '@nestjs/testing';
import { GalleryGroupsService } from './gallery-groups.service';

describe('GalleryGroupsService', () => {
  let service: GalleryGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryGroupsService],
    }).compile();

    service = module.get<GalleryGroupsService>(GalleryGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
