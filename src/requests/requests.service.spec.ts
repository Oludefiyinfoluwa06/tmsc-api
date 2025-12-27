import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Status, RequestType } from '@prisma/client';

describe('RequestsService', () => {
  let service: RequestsService;

  const mockRequest: Request = {
    id: '1',
    type: RequestType.CONCEPT_PACK,
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    company: 'Test Company',
    message: 'Test message',
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    request: {
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
        RequestsService,
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

    service = module.get<RequestsService>(RequestsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new request and emit event', async () => {
      const createData = {
        type: RequestType.TITANIUM_PACK,
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        company: 'New Company',
        message: 'New request',
      };

      mockPrismaService.request.create.mockResolvedValue({
        ...mockRequest,
        ...createData,
      });

      const result = await service.create(createData);

      expect(mockPrismaService.request.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('request.created', {
        ...mockRequest,
        ...createData,
      });
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all requests ordered by creation date', async () => {
      const requests = [mockRequest, { ...mockRequest, id: '2' }];
      mockPrismaService.request.findMany.mockResolvedValue(requests);

      const result = await service.findAll();

      expect(result).toEqual(requests);
      expect(mockPrismaService.request.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should find a request by id', async () => {
      mockPrismaService.request.findUnique.mockResolvedValue(mockRequest);

      const result = await service.findOne('1');

      expect(result).toEqual(mockRequest);
      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if request not found', async () => {
      mockPrismaService.request.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update request status', async () => {
      mockPrismaService.request.update.mockResolvedValue({
        ...mockRequest,
        status: Status.COMPLETED,
      });

      const result = await service.updateStatus('1', Status.COMPLETED);

      expect(mockPrismaService.request.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: Status.COMPLETED },
      });
      expect(result.status).toBe(Status.COMPLETED);
    });
  });

  describe('remove', () => {
    it('should delete a request', async () => {
      mockPrismaService.request.delete.mockResolvedValue(mockRequest);

      const result = await service.remove('1');

      expect(result).toEqual(mockRequest);
      expect(mockPrismaService.request.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
