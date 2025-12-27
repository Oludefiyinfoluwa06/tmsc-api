import { Test, TestingModule } from '@nestjs/testing';
import { MandatesController } from './mandates.controller';
import { MandatesService } from './mandates.service';
import { Status } from '@prisma/client';

describe('MandatesController', () => {
  let controller: MandatesController;

  const mockMandate = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    organization: 'Test Company',
    audienceType: 'Corporate',
    message: 'Test mandate',
    briefFileUrl: null,
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMandatesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MandatesController],
      providers: [
        {
          provide: MandatesService,
          useValue: mockMandatesService,
        },
      ],
    }).compile();

    controller = module.get<MandatesController>(MandatesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submit', () => {
    it('should create a new mandate', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        organization: 'New Company',
        audienceType: 'Corporate',
        message: 'New mandate',
      };

      mockMandatesService.create.mockResolvedValue({
        ...mockMandate,
        ...createData,
      });

      const result = await controller.submit(createData);

      expect(mockMandatesService.create).toHaveBeenCalledWith(createData);
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all mandates', async () => {
      const mandates = [mockMandate, { ...mockMandate, id: '2' }];
      mockMandatesService.findAll.mockResolvedValue(mandates);

      const result = await controller.findAll();

      expect(mockMandatesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mandates);
    });
  });

  describe('findOne', () => {
    it('should return a single mandate', async () => {
      mockMandatesService.findOne.mockResolvedValue(mockMandate);

      const result = await controller.findOne('1');

      expect(mockMandatesService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMandate);
    });
  });

  describe('updateStatus', () => {
    it('should update mandate status', async () => {
      mockMandatesService.updateStatus.mockResolvedValue({
        ...mockMandate,
        status: Status.REVIEWING,
      });

      const result = await controller.updateStatus('1', Status.REVIEWING);

      expect(mockMandatesService.updateStatus).toHaveBeenCalledWith(
        '1',
        Status.REVIEWING,
      );
      expect(result.status).toBe(Status.REVIEWING);
    });
  });

  describe('remove', () => {
    it('should delete a mandate', async () => {
      mockMandatesService.remove.mockResolvedValue(mockMandate);

      const result = await controller.remove('1');

      expect(mockMandatesService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMandate);
    });
  });
});
