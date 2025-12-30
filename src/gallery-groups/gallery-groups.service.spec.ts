import { Test, TestingModule } from '@nestjs/testing';
import { GalleryGroupsService } from './gallery-groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { GalleryGroup, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('GalleryGroupsService', () => {
  let service: GalleryGroupsService;

  const mockGalleryGroup: GalleryGroup = {
    id: '1',
    title: 'Test Group',
    description: 'Test Description',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    galleryGroup: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryGroupsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GalleryGroupsService>(GalleryGroupsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new gallery group', async () => {
      const createData: Partial<Prisma.GalleryGroupCreateInput> = {
        title: 'New Group',
        description: 'New Description',
        order: 1,
      };

      mockPrismaService.galleryGroup.create.mockResolvedValue({
        ...mockGalleryGroup,
        ...createData,
      });

      const result = await service.create(
        createData as Prisma.GalleryGroupCreateInput,
      );

      expect(mockPrismaService.galleryGroup.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result.title).toBe('New Group');
    });
  });

  describe('findAllPublic', () => {
    it('should find all active gallery groups for public endpoint', async () => {
      const groups = [mockGalleryGroup];
      mockPrismaService.galleryGroup.findMany.mockResolvedValue(groups);

      const result = await service.findAllPublic();

      expect(mockPrismaService.galleryGroup.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          images: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      });
      expect(result).toEqual(groups);
    });
  });

  describe('findAll', () => {
    it('should find all active groups', async () => {
      const groups = [mockGalleryGroup];
      mockPrismaService.galleryGroup.findMany.mockResolvedValue(groups);

      const result = await service.findAll();

      expect(mockPrismaService.galleryGroup.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          images: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      });
      expect(result).toEqual(groups);
    });
  });

  describe('findOne', () => {
    it('should find a gallery group by id', async () => {
      mockPrismaService.galleryGroup.findUnique.mockResolvedValue(
        mockGalleryGroup,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(mockGalleryGroup);
      expect(mockPrismaService.galleryGroup.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    it('should throw NotFoundException if group not found', async () => {
      mockPrismaService.galleryGroup.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow(
        'Gallery group with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a gallery group', async () => {
      const updateData = {
        title: 'Updated Name',
        isActive: false,
      };

      mockPrismaService.galleryGroup.update.mockResolvedValue({
        ...mockGalleryGroup,
        ...updateData,
      });

      const result = await service.update('1', updateData);

      expect(mockPrismaService.galleryGroup.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result.title).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should delete a gallery group', async () => {
      mockPrismaService.galleryGroup.delete.mockResolvedValue(mockGalleryGroup);

      const result = await service.remove('1');

      expect(result).toEqual(mockGalleryGroup);
      expect(mockPrismaService.galleryGroup.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('reorder', () => {
    it('should reorder multiple gallery groups', async () => {
      const items = [
        { id: '1', order: 3 },
        { id: '2', order: 1 },
        { id: '3', order: 2 },
      ];

      mockPrismaService.galleryGroup.update.mockResolvedValue(mockGalleryGroup);

      await service.reorder(items);

      expect(mockPrismaService.galleryGroup.update).toHaveBeenCalledTimes(3);
      expect(mockPrismaService.galleryGroup.update).toHaveBeenNthCalledWith(1, {
        where: { id: '1' },
        data: { order: 3 },
      });
    });
  });
});
