import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Status } from '@prisma/client';

describe('ContactController', () => {
  let controller: ContactController;

  const mockContact = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    organization: 'Test Company',
    audienceType: 'Corporate',
    message: 'Test contact',
    briefFileUrl: null,
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContactService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: mockContactService,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submit', () => {
    it('should create a new contact', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        organization: 'New Company',
        audienceType: 'Corporate',
        message: 'New contact',
      };

      mockContactService.create.mockResolvedValue({
        ...mockContact,
        ...createData,
      });

      const result = await controller.submit(createData);

      expect(mockContactService.create).toHaveBeenCalledWith(createData);
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all contacts', async () => {
      const contacts = [mockContact, { ...mockContact, id: '2' }];
      mockContactService.findAll.mockResolvedValue(contacts);

      const result = await controller.findAll();

      expect(mockContactService.findAll).toHaveBeenCalled();
      expect(result).toEqual(contacts);
    });
  });

  describe('findOne', () => {
    it('should return a single contact', async () => {
      mockContactService.findOne.mockResolvedValue(mockContact);

      const result = await controller.findOne('1');

      expect(mockContactService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockContact);
    });
  });

  describe('updateStatus', () => {
    it('should update contact status', async () => {
      mockContactService.updateStatus.mockResolvedValue({
        ...mockContact,
        status: Status.COMPLETED,
      });

      const result = await controller.updateStatus('1', Status.COMPLETED);

      expect(mockContactService.updateStatus).toHaveBeenCalledWith(
        '1',
        Status.COMPLETED,
      );
      expect(result.status).toBe(Status.COMPLETED);
    });
  });

  describe('remove', () => {
    it('should delete a contact', async () => {
      mockContactService.remove.mockResolvedValue(mockContact);

      const result = await controller.remove('1');

      expect(mockContactService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockContact);
    });
  });
});
