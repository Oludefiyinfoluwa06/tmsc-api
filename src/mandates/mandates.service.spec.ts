import { Test, TestingModule } from '@nestjs/testing';
import { MandatesService } from './mandates.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Mandate, Status } from '@prisma/client';

describe('MandatesService', () => {
  let service: MandatesService;

  const mockMandate: Mandate = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    organization: 'Test Company',
    audienceType: 'Corporate',
    message: 'Test mandate message',
    briefFileUrl: null,
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    mandate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MandatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<MandatesService>(MandatesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new mandate and emit event', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        organization: 'New Company',
        audienceType: 'Corporate',
        message: 'New mandate request',
      };

      mockPrismaService.mandate.create.mockResolvedValue({
        ...mockMandate,
        ...createData,
      });

      const result = await service.create(createData);

      expect(mockPrismaService.mandate.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('mandate.created', {
        ...mockMandate,
        ...createData,
      });
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all mandates ordered by creation date', async () => {
      const mandates = [mockMandate, { ...mockMandate, id: '2' }];
      mockPrismaService.mandate.findMany.mockResolvedValue(mandates);

      const result = await service.findAll();

      expect(result).toEqual(mandates);
      expect(mockPrismaService.mandate.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should find a mandate by id', async () => {
      mockPrismaService.mandate.findUnique.mockResolvedValue(mockMandate);

      const result = await service.findOne('1');

      expect(result).toEqual(mockMandate);
      expect(mockPrismaService.mandate.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if mandate not found', async () => {
      mockPrismaService.mandate.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update mandate status', async () => {
      mockPrismaService.mandate.update.mockResolvedValue({
        ...mockMandate,
        status: Status.REVIEWING,
      });

      const result = await service.updateStatus('1', Status.REVIEWING);

      expect(mockPrismaService.mandate.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: Status.REVIEWING },
      });
      expect(result.status).toBe(Status.REVIEWING);
    });
  });

  describe('remove', () => {
    it('should delete a mandate', async () => {
      mockPrismaService.mandate.delete.mockResolvedValue(mockMandate);

      const result = await service.remove('1');

      expect(result).toEqual(mockMandate);
      expect(mockPrismaService.mandate.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
