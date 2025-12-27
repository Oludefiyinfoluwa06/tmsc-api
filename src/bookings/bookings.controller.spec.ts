import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Status } from '@prisma/client';

describe('BookingsController', () => {
  let controller: BookingsController;

  const mockBooking = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    organization: 'Test Company',
    audienceType: 'Corporate',
    preferredDate: new Date('2024-12-30'),
    preferredTime: '10:00 AM',
    message: 'Test booking',
    status: Status.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('book', () => {
    it('should create a new booking', async () => {
      const createData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        phone: '+9876543210',
        organization: 'New Company',
        audienceType: 'Corporate',
        preferredDate: new Date('2025-01-15'),
        preferredTime: '2:00 PM',
        message: 'New booking',
      };

      mockBookingsService.create.mockResolvedValue({
        ...mockBooking,
        ...createData,
      });

      const result = await controller.book(createData);

      expect(mockBookingsService.create).toHaveBeenCalledWith(createData);
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const bookings = [mockBooking, { ...mockBooking, id: '2' }];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll();

      expect(mockBookingsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(bookings);
    });
  });

  describe('findOne', () => {
    it('should return a single booking', async () => {
      mockBookingsService.findOne.mockResolvedValue(mockBooking);

      const result = await controller.findOne('1');

      expect(mockBookingsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBooking);
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      mockBookingsService.updateStatus.mockResolvedValue({
        ...mockBooking,
        status: Status.CONFIRMED,
      });

      const result = await controller.updateStatus('1', Status.CONFIRMED);

      expect(mockBookingsService.updateStatus).toHaveBeenCalledWith(
        '1',
        Status.CONFIRMED,
      );
      expect(result.status).toBe(Status.CONFIRMED);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      mockBookingsService.remove.mockResolvedValue(mockBooking);

      const result = await controller.remove('1');

      expect(mockBookingsService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBooking);
    });
  });
});
