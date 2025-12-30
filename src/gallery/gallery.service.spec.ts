import { Test, TestingModule } from '@nestjs/testing';
import { GalleryService } from './gallery.service';
import { PrismaService } from '../prisma/prisma.service';
import { Gallery, Prisma } from '@prisma/client';

describe('GalleryService', () => {
  let service: GalleryService;

  const mockGallery: Gallery = {
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

  const mockPrismaService = {
    gallery: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPublic', () => {
    it('should find all active galleries', async () => {
      const galleries = [mockGallery];
      mockPrismaService.gallery.findMany.mockResolvedValue(galleries);

      const result = await service.findAllPublic();

      expect(result).toEqual(galleries);
      expect(mockPrismaService.gallery.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
        },
        orderBy: { order: 'asc' },
      });
    });

    it('should filter by groupId when provided', async () => {
      const galleries = [{ ...mockGallery, groupId: 'group1' }];
      mockPrismaService.gallery.findMany.mockResolvedValue(galleries);

      await service.findAllPublic('group1');

      expect(mockPrismaService.gallery.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          groupId: 'group1',
        },
        orderBy: { order: 'asc' },
      });
    });

    it('should filter for null groupId when explicitly passed null', async () => {
      const galleries = [mockGallery];
      mockPrismaService.gallery.findMany.mockResolvedValue(galleries);

      await service.findAllPublic(null);

      expect(mockPrismaService.gallery.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          groupId: { equals: null },
        },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('findAllAdmin', () => {
    it('should find all galleries (including inactive) for admin', async () => {
      const galleries = [
        mockGallery,
        { ...mockGallery, id: '2', isActive: false },
      ];
      mockPrismaService.gallery.findMany.mockResolvedValue(galleries);

      const result = await service.findAllAdmin();

      expect(result).toEqual(galleries);
      expect(mockPrismaService.gallery.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { order: 'asc' },
      });
    });

    it('should filter by groupId for admin when provided', async () => {
      mockPrismaService.gallery.findMany.mockResolvedValue([mockGallery]);

      await service.findAllAdmin('group2');

      expect(mockPrismaService.gallery.findMany).toHaveBeenCalledWith({
        where: {
          groupId: 'group2',
        },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('should create a new gallery item', async () => {
      const createData: Partial<Prisma.GalleryCreateInput> = {
        imageUrl: 'https://example.com/new.jpg',
        caption: 'New Image',
        order: 5,
      };

      mockPrismaService.gallery.create.mockResolvedValue({
        ...mockGallery,
        ...createData,
      });

      const result = await service.create(
        createData as Prisma.GalleryCreateInput,
      );

      expect(mockPrismaService.gallery.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toHaveProperty('imageUrl', createData.imageUrl);
    });
  });

  describe('findOne', () => {
    it('should find one gallery item by id', async () => {
      mockPrismaService.gallery.findUnique.mockResolvedValue(mockGallery);

      const result = await service.findOne('1');

      expect(result).toEqual(mockGallery);
      expect(mockPrismaService.gallery.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if gallery not found', async () => {
      mockPrismaService.gallery.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a gallery item', async () => {
      const updateData = {
        caption: 'Updated Alt Text',
        isActive: false,
      };

      mockPrismaService.gallery.update.mockResolvedValue({
        ...mockGallery,
        ...updateData,
      });

      const result = await service.update('1', updateData);

      expect(mockPrismaService.gallery.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result.caption).toBe('Updated Alt Text');
    });
  });

  describe('remove', () => {
    it('should delete a gallery item', async () => {
      mockPrismaService.gallery.delete.mockResolvedValue(mockGallery);

      const result = await service.remove('1');

      expect(result).toEqual(mockGallery);
      expect(mockPrismaService.gallery.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('reorder', () => {
    it('should reorder multiple gallery items', async () => {
      const items = [
        { id: '1', order: 2 },
        { id: '2', order: 1 },
        { id: '3', order: 3 },
      ];

      mockPrismaService.gallery.update.mockResolvedValue(mockGallery);

      await service.reorder(items);

      expect(mockPrismaService.gallery.update).toHaveBeenCalledTimes(3);
      expect(mockPrismaService.gallery.update).toHaveBeenNthCalledWith(1, {
        where: { id: '1' },
        data: { order: 2 },
      });
      expect(mockPrismaService.gallery.update).toHaveBeenNthCalledWith(2, {
        where: { id: '2' },
        data: { order: 1 },
      });
    });
  });
});
