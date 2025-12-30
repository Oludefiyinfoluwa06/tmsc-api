import { Test, TestingModule } from '@nestjs/testing';
import { GalleryGroupsController } from './gallery-groups.controller';
import { GalleryGroupsService } from './gallery-groups.service';
import { Prisma } from '@prisma/client';

describe('GalleryGroupsController', () => {
  let controller: GalleryGroupsController;

  const mockGalleryGroup = {
    id: '1',
    title: 'Test Group',
    description: 'Test Description',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGalleryGroupsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPublic: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    reorder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryGroupsController],
      providers: [
        {
          provide: GalleryGroupsService,
          useValue: mockGalleryGroupsService,
        },
      ],
    }).compile();

    controller = module.get<GalleryGroupsController>(GalleryGroupsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublicGroups', () => {
    it('should return all active gallery groups', async () => {
      const groups = [mockGalleryGroup, { ...mockGalleryGroup, id: '2' }];
      mockGalleryGroupsService.findAllPublic.mockResolvedValue(groups);

      const result = await controller.getPublicGroups();

      expect(mockGalleryGroupsService.findAllPublic).toHaveBeenCalled();
      expect(result).toEqual(groups);
    });
  });

  describe('findAll', () => {
    it('should return all gallery groups', async () => {
      const groups = [mockGalleryGroup, { ...mockGalleryGroup, id: '2' }];
      mockGalleryGroupsService.findAll.mockResolvedValue(groups);

      const result = await controller.findAll();

      expect(mockGalleryGroupsService.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(groups);
    });
  });

  describe('findOne', () => {
    it('should return a single gallery group', async () => {
      mockGalleryGroupsService.findOne.mockResolvedValue(mockGalleryGroup);

      const result = await controller.findOne('1');

      expect(mockGalleryGroupsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockGalleryGroup);
    });
  });

  describe('create', () => {
    it('should create a new gallery group', async () => {
      const createData: Partial<Prisma.GalleryGroupCreateInput> = {
        title: 'New Group',
        description: 'New Description',
        order: 2,
      };

      mockGalleryGroupsService.create.mockResolvedValue({
        ...mockGalleryGroup,
        ...createData,
      });

      const result = await controller.create(
        createData as Prisma.GalleryGroupCreateInput,
      );

      expect(mockGalleryGroupsService.create).toHaveBeenCalledWith(createData);
      expect(result.title).toBe('New Group');
    });
  });

  describe('update', () => {
    it('should update a gallery group', async () => {
      const updateData = {
        title: 'Updated Name',
        isActive: false,
      };

      mockGalleryGroupsService.update.mockResolvedValue({
        ...mockGalleryGroup,
        ...updateData,
      });

      const result = await controller.update('1', updateData);

      expect(mockGalleryGroupsService.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
      expect(result.title).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should delete a gallery group', async () => {
      mockGalleryGroupsService.remove.mockResolvedValue(mockGalleryGroup);

      const result = await controller.remove('1');

      expect(mockGalleryGroupsService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockGalleryGroup);
    });
  });

  describe('reorder', () => {
    it('should reorder gallery groups', async () => {
      const items = [
        { id: '1', order: 3 },
        { id: '2', order: 1 },
      ];

      mockGalleryGroupsService.reorder.mockResolvedValue([mockGalleryGroup]);

      await controller.reorder(items);

      expect(mockGalleryGroupsService.reorder).toHaveBeenCalledWith(items);
    });
  });
});
