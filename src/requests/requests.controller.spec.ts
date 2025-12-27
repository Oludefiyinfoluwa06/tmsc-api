import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { Status, RequestType } from '@prisma/client';

describe('RequestsController', () => {
  let controller: RequestsController;

  const mockRequest = {
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

  const mockRequestsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: mockRequestsService,
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestConceptPack', () => {
    it('should create a concept pack request', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        company: 'New Company',
        message: 'New request',
      };

      mockRequestsService.create.mockResolvedValue({
        ...mockRequest,
        ...createData,
        type: RequestType.CONCEPT_PACK,
      });

      const result = await controller.requestConceptPack(createData);

      expect(mockRequestsService.create).toHaveBeenCalledWith({
        ...createData,
        type: RequestType.CONCEPT_PACK,
      });
      expect(result.type).toBe(RequestType.CONCEPT_PACK);
    });
  });

  describe('requestTitaniumPack', () => {
    it('should create a titanium pack request', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        company: 'New Company',
        message: 'New titanium request',
      };

      mockRequestsService.create.mockResolvedValue({
        ...mockRequest,
        ...createData,
        type: RequestType.TITANIUM_PACK,
      });

      const result = await controller.requestTitaniumPack(createData);

      expect(mockRequestsService.create).toHaveBeenCalledWith({
        ...createData,
        type: RequestType.TITANIUM_PACK,
      });
      expect(result.type).toBe(RequestType.TITANIUM_PACK);
    });
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      const requests = [mockRequest, { ...mockRequest, id: '2' }];
      mockRequestsService.findAll.mockResolvedValue(requests);

      const result = await controller.findAll();

      expect(mockRequestsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(requests);
    });
  });

  describe('findOne', () => {
    it('should return a single request', async () => {
      mockRequestsService.findOne.mockResolvedValue(mockRequest);

      const result = await controller.findOne('1');

      expect(mockRequestsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRequest);
    });
  });

  describe('updateStatus', () => {
    it('should update request status', async () => {
      mockRequestsService.updateStatus.mockResolvedValue({
        ...mockRequest,
        status: Status.COMPLETED,
      });

      const result = await controller.updateStatus('1', Status.COMPLETED);

      expect(mockRequestsService.updateStatus).toHaveBeenCalledWith(
        '1',
        Status.COMPLETED,
      );
      expect(result.status).toBe(Status.COMPLETED);
    });
  });

  describe('remove', () => {
    it('should delete a request', async () => {
      mockRequestsService.remove.mockResolvedValue(mockRequest);

      const result = await controller.remove('1');

      expect(mockRequestsService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRequest);
    });
  });
});
