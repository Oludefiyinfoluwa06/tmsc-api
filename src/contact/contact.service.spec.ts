import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Contact, Status } from '@prisma/client';

describe('ContactService', () => {
  let service: ContactService;

  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    organization: 'Test Company',
    audienceType: 'Corporate',
    message: 'Test contact message',
    briefFileUrl: null,
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    contact: {
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
        ContactService,
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

    service = module.get<ContactService>(ContactService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new contact and emit event', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        organization: 'New Company',
        audienceType: 'Corporate',
        message: 'New contact message',
      };

      mockPrismaService.contact.create.mockResolvedValue({
        ...mockContact,
        ...createData,
      });

      const result = await service.create(createData);

      expect(mockPrismaService.contact.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('contact.created', {
        ...mockContact,
        ...createData,
      });
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all contacts ordered by creation date', async () => {
      const contacts = [mockContact, { ...mockContact, id: '2' }];
      mockPrismaService.contact.findMany.mockResolvedValue(contacts);

      const result = await service.findAll();

      expect(result).toEqual(contacts);
      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should find a contact by id', async () => {
      mockPrismaService.contact.findUnique.mockResolvedValue(mockContact);

      const result = await service.findOne('1');

      expect(result).toEqual(mockContact);
      expect(mockPrismaService.contact.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if contact not found', async () => {
      mockPrismaService.contact.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update contact status', async () => {
      mockPrismaService.contact.update.mockResolvedValue({
        ...mockContact,
        status: Status.COMPLETED,
      });

      const result = await service.updateStatus('1', Status.COMPLETED);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: Status.COMPLETED },
      });
      expect(result.status).toBe(Status.COMPLETED);
    });
  });

  describe('remove', () => {
    it('should delete a contact', async () => {
      mockPrismaService.contact.delete.mockResolvedValue(mockContact);

      const result = await service.remove('1');

      expect(result).toEqual(mockContact);
      expect(mockPrismaService.contact.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
