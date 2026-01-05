import { Test, TestingModule } from '@nestjs/testing';
import { ModularCentersController } from './modular-centers.controller';
import { ModularCentersService } from './modular-centers.service';
import {
  CreateModularCenterDto,
  UpdateModularCenterDto,
  AddCenterImageDto,
  UpdateCenterImageDto,
} from './modular-centers.dto';

describe('ModularCentersController', () => {
  let controller: ModularCentersController;

  const mockCenter = {
    id: 'center-1',
    title: 'Test Center',
    isActive: true,
  };

  const mockImage = {
    id: 'image-1',
    imageUrl: 'test-url',
  };

  const mockModularCentersService = {
    findAllPublic: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    reorder: jest.fn(),
    addImage: jest.fn(),
    updateImage: jest.fn(),
    removeImage: jest.fn(),
    reorderImages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModularCentersController],
      providers: [
        {
          provide: ModularCentersService,
          useValue: mockModularCentersService,
        },
      ],
    }).compile();

    controller = module.get<ModularCentersController>(ModularCentersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Public Endpoints', () => {
    it('findAllPublic should return active centers', async () => {
      mockModularCentersService.findAllPublic.mockResolvedValue([mockCenter]);
      const result = await controller.findAllPublic();
      expect(result).toEqual([mockCenter]);
      expect(mockModularCentersService.findAllPublic).toHaveBeenCalled();
    });

    it('findOnePublic should return a center', async () => {
      mockModularCentersService.findOne.mockResolvedValue(mockCenter);
      const result = await controller.findOnePublic('center-1');
      expect(result).toEqual(mockCenter);
      expect(mockModularCentersService.findOne).toHaveBeenCalledWith(
        'center-1',
      );
    });
  });

  describe('Admin Endpoints - Centers', () => {
    it('findAll should return all centers', async () => {
      mockModularCentersService.findAll.mockResolvedValue([mockCenter]);
      const result = await controller.findAll();
      expect(result).toEqual([mockCenter]);
      expect(mockModularCentersService.findAll).toHaveBeenCalled();
    });

    it('create should create a center', async () => {
      const dto: CreateModularCenterDto = { title: 'New' };
      mockModularCentersService.create.mockResolvedValue(mockCenter);
      const result = await controller.create(dto);
      expect(result).toEqual(mockCenter);
      expect(mockModularCentersService.create).toHaveBeenCalledWith(dto);
    });

    it('update should update a center', async () => {
      const dto: UpdateModularCenterDto = { title: 'Updated' };
      mockModularCentersService.update.mockResolvedValue(mockCenter);
      const result = await controller.update('center-1', dto);
      expect(result).toEqual(mockCenter);
      expect(mockModularCentersService.update).toHaveBeenCalledWith(
        'center-1',
        dto,
      );
    });

    it('remove should delete a center', async () => {
      mockModularCentersService.remove.mockResolvedValue(mockCenter);
      const result = await controller.remove('center-1');
      expect(result).toEqual(mockCenter);
      expect(mockModularCentersService.remove).toHaveBeenCalledWith('center-1');
    });

    it('reorder should reorder centers', async () => {
      const ids = ['id1', 'id2'];
      await controller.reorder({ ids });
      expect(mockModularCentersService.reorder).toHaveBeenCalledWith(ids);
    });
  });

  describe('Admin Endpoints - Images', () => {
    it('addImage should add image to center', async () => {
      const dto: AddCenterImageDto = { imageUrl: 'url' };
      mockModularCentersService.addImage.mockResolvedValue(mockImage);
      const result = await controller.addImage('center-1', dto);
      expect(result).toEqual(mockImage);
      expect(mockModularCentersService.addImage).toHaveBeenCalledWith(
        'center-1',
        dto,
      );
    });

    it('updateImage should update image', async () => {
      const dto: UpdateCenterImageDto = { caption: 'Updated' };
      mockModularCentersService.updateImage.mockResolvedValue(mockImage);
      const result = await controller.updateImage('image-1', dto);
      expect(result).toEqual(mockImage);
      expect(mockModularCentersService.updateImage).toHaveBeenCalledWith(
        'image-1',
        dto,
      );
    });

    it('removeImage should delete image', async () => {
      mockModularCentersService.removeImage.mockResolvedValue(mockImage);
      const result = await controller.removeImage('image-1');
      expect(result).toEqual(mockImage);
      expect(mockModularCentersService.removeImage).toHaveBeenCalledWith(
        'image-1',
      );
    });

    it('reorderImages should reorder center images', async () => {
      const ids = ['img1', 'img2'];
      await controller.reorderImages('center-1', { ids });
      expect(mockModularCentersService.reorderImages).toHaveBeenCalledWith(
        'center-1',
        ids,
      );
    });
  });
});
