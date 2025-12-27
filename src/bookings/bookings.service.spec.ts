import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking, Status } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBooking: Booking = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    organization: 'Test Company',
    audienceType: 'Corporate',
    preferredDate: new Date('2024-12-30'),
    preferredTime: '10:00 AM',
    message: 'Test booking message',
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    booking: {
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
        BookingsService,
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

    service = module.get<BookingsService>(BookingsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking and emit event', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        organization: 'New Company',
        audienceType: 'Corporate',
        preferredDate: new Date('2025-01-15'),
        preferredTime: '2:00 PM',
        message: 'New booking request',
      };

      mockPrismaService.booking.create.mockResolvedValue({
        ...mockBooking,
        ...createData,
      });

      const result = await service.create(createData);

      expect(mockPrismaService.booking.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('booking.created', {
        ...mockBooking,
        ...createData,
      });
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all bookings ordered by creation date', async () => {
      const bookings = [mockBooking, { ...mockBooking, id: '2' }];
      mockPrismaService.booking.findMany.mockResolvedValue(bookings);

      const result = await service.findAll();

      expect(result).toEqual(bookings);
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should find a booking by id', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await service.findOne('1');

      expect(result).toEqual(mockBooking);
      expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if booking not found', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      mockPrismaService.booking.update.mockResolvedValue({
        ...mockBooking,
        status: Status.REVIEWING,
      });

      const result = await service.updateStatus('1', Status.REVIEWING);

      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: Status.REVIEWING },
      });
      expect(result.status).toBe(Status.REVIEWING);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      mockPrismaService.booking.delete.mockResolvedValue(mockBooking);

      const result = await service.remove('1');

      expect(result).toEqual(mockBooking);
      expect(mockPrismaService.booking.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
