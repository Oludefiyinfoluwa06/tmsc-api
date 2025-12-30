import { Test, TestingModule } from '@nestjs/testing';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

describe('GalleryController', () => {
  let controller: GalleryController;

  const mockGallery = {
    id: '1',
    imageUrl: 'https://example.com/image.jpg',
    caption: 'Test Image',
    description: null,
    order: 1,
    isActive: true,
    groupId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGalleryService = {
    findAllPublic: jest.fn(),
    findAllAdmin: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    reorder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryController],
      providers: [
        {
          provide: GalleryService,
          useValue: mockGalleryService,
        },
      ],
    }).compile();

    controller = module.get<GalleryController>(GalleryController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublicGallery', () => {
    it('should return all active galleries', async () => {
      const galleries = [mockGallery];
      mockGalleryService.findAllPublic.mockResolvedValue(galleries);

      const result = await controller.getPublicGallery();

      expect(mockGalleryService.findAllPublic).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(galleries);
    });

    it('should filter by groupId when provided', async () => {
      mockGalleryService.findAllPublic.mockResolvedValue([mockGallery]);

      await controller.getPublicGallery('group1');

      expect(mockGalleryService.findAllPublic).toHaveBeenCalledWith('group1');
    });
  });

  describe('getAdminGallery', () => {
    it('should return admin gallery filtered by groupId', async () => {
      const galleries = [mockGallery];
      mockGalleryService.findAllAdmin.mockResolvedValue(galleries);

      const result = await controller.getAdminGallery('group1');

      expect(mockGalleryService.findAllAdmin).toHaveBeenCalledWith('group1');
      expect(result).toEqual(galleries);
    });
  });

  describe('create', () => {
    it('should create a new gallery item', async () => {
      const createData = {
        imageUrl: 'https://example.com/new.jpg',
        caption: 'New Image',
        order: 5,
      };

      mockGalleryService.create.mockResolvedValue({
        ...mockGallery,
        ...createData,
      });

      const result = await controller.create(createData);

      expect(mockGalleryService.create).toHaveBeenCalled();
      expect(result.imageUrl).toBe(createData.imageUrl);
    });

    it('should handle groupId in create', async () => {
      const createData = {
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Grouped Image',
        order: 1,
        groupId: 'group123',
      };

      mockGalleryService.create.mockResolvedValue(mockGallery);

      await controller.create(createData);

      expect(mockGalleryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          group: { connect: { id: 'group123' } },
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a gallery item', async () => {
      const updateData = {
        caption: 'Updated Alt Text',
        isActive: false,
      };

      mockGalleryService.update.mockResolvedValue({
        ...mockGallery,
        ...updateData,
      });

      const result = await controller.update('1', updateData);

      expect(mockGalleryService.update).toHaveBeenCalled();
      expect(result.caption).toBe('Updated Alt Text');
    });
  });

  describe('remove', () => {
    it('should delete a gallery item', async () => {
      mockGalleryService.remove.mockResolvedValue(mockGallery);

      const result = await controller.remove('1');

      expect(mockGalleryService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockGallery);
    });
  });

  describe('reorder', () => {
    it('should reorder gallery items', async () => {
      const items = [
        { id: '1', order: 2 },
        { id: '2', order: 1 },
      ];

      mockGalleryService.reorder.mockResolvedValue([mockGallery]);

      await controller.reorder(items);

      expect(mockGalleryService.reorder).toHaveBeenCalledWith(items);
    });
  });
});
