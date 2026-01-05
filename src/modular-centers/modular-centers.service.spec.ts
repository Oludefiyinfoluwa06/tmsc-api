import { Test, TestingModule } from '@nestjs/testing';
import { ModularCentersService } from './modular-centers.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ModularCenter,
  CenterImage,
  CenterImageType as PrismaCenterImageType,
} from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import {
  CreateModularCenterDto,
  AddCenterImageDto,
  CenterImageType,
} from './modular-centers.dto';

describe('ModularCentersService', () => {
  let service: ModularCentersService;

  const mockCenter: ModularCenter = {
    id: 'center-1',
    title: 'Test Center',
    location: 'Test Location',
    description: 'Test Description',
    order: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockImage: CenterImage = {
    id: 'image-1',
    imageUrl: 'test-url',
    caption: 'Test Caption',
    type: PrismaCenterImageType.MACHINE,
    order: 0,
    isActive: true,
    centerId: 'center-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    modularCenter: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    centerImage: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModularCentersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ModularCentersService>(ModularCentersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Centers', () => {
    describe('findAllPublic', () => {
      it('should return all active centers with active images', async () => {
        mockPrismaService.modularCenter.findMany.mockResolvedValue([
          mockCenter,
        ]);
        const result = await service.findAllPublic();
        expect(result).toEqual([mockCenter]);
        expect(mockPrismaService.modularCenter.findMany).toHaveBeenCalledWith({
          where: { isActive: true },
          include: {
            images: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        });
      });
    });

    describe('findAll', () => {
      it('should return all centers', async () => {
        mockPrismaService.modularCenter.findMany.mockResolvedValue([
          mockCenter,
        ]);
        const result = await service.findAll();
        expect(result).toEqual([mockCenter]);
        expect(mockPrismaService.modularCenter.findMany).toHaveBeenCalled();
      });
    });

    describe('findOne', () => {
      it('should return a center if found', async () => {
        mockPrismaService.modularCenter.findUnique.mockResolvedValue(
          mockCenter,
        );
        const result = await service.findOne('center-1');
        expect(result).toEqual(mockCenter);
      });

      it('should throw NotFoundException if not found', async () => {
        mockPrismaService.modularCenter.findUnique.mockResolvedValue(null);
        await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      });
    });

    describe('create', () => {
      it('should create a center', async () => {
        const dto: CreateModularCenterDto = { title: 'New Center' };
        mockPrismaService.modularCenter.create.mockResolvedValue({
          ...mockCenter,
          ...dto,
        });
        const result = await service.create(dto);
        expect(result.title).toBe('New Center');
        expect(mockPrismaService.modularCenter.create).toHaveBeenCalledWith({
          data: dto,
        });
      });
    });

    describe('reorder', () => {
      it('should reorder centers in a transaction', async () => {
        const ids = ['id1', 'id2'];
        await service.reorder(ids);
        expect(mockPrismaService.$transaction).toHaveBeenCalled();
        expect(mockPrismaService.modularCenter.update).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Images', () => {
    describe('addImage', () => {
      it('should add an image to a center', async () => {
        mockPrismaService.modularCenter.findUnique.mockResolvedValue(
          mockCenter,
        );
        const dto: AddCenterImageDto = {
          imageUrl: 'url',
          type: CenterImageType.TRAINING,
        };
        mockPrismaService.centerImage.create.mockResolvedValue({
          ...mockImage,
          ...dto,
          type: PrismaCenterImageType.TRAINING,
        });

        const result = await service.addImage('center-1', dto);
        expect(result.imageUrl).toBe('url');
        expect(mockPrismaService.centerImage.create).toHaveBeenCalled();
      });
    });

    describe('reorderImages', () => {
      it('should reorder center images in a transaction', async () => {
        const ids = ['img1', 'img2'];
        await service.reorderImages('center-1', ids);
        expect(mockPrismaService.$transaction).toHaveBeenCalled();
        expect(mockPrismaService.centerImage.update).toHaveBeenCalledTimes(2);
      });
    });
  });
});
