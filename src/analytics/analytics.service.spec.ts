import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductType, Status } from '@prisma/client';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrismaService = {
    mandate: {
      count: jest.fn(),
    },
    booking: {
      count: jest.fn(),
    },
    request: {
      count: jest.fn(),
    },
    contact: {
      count: jest.fn(),
    },
    gallery: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should return comprehensive dashboard statistics', async () => {
      // Mock mandate stats
      mockPrismaService.mandate.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(10) // new
        .mockResolvedValueOnce(15) // reviewing
        .mockResolvedValueOnce(20) // contacted
        .mockResolvedValueOnce(5); // closed

      // Mock booking stats
      mockPrismaService.booking.count
        .mockResolvedValueOnce(30) // total
        .mockResolvedValueOnce(5) // new
        .mockResolvedValueOnce(10) // confirmed
        .mockResolvedValueOnce(15); // completed

      // Mock request stats
      mockPrismaService.request.count
        .mockResolvedValueOnce(20) // concept pack
        .mockResolvedValueOnce(15); // titanium pack

      // Mock contact stats
      mockPrismaService.contact.count
        .mockResolvedValueOnce(40) // total
        .mockResolvedValueOnce(12); // new

      // Mock gallery stats
      mockPrismaService.gallery.count
        .mockResolvedValueOnce(25) // modoola
        .mockResolvedValueOnce(18) // machine exchange
        .mockResolvedValueOnce(22) // titanium laser
        .mockResolvedValueOnce(30); // projects

      const result = await service.getDashboardStats();

      expect(result).toEqual({
        mandates: {
          total: 50,
          new: 10,
          reviewing: 15,
          contacted: 20,
          closed: 5,
        },
        bookings: { total: 30, new: 5, confirmed: 10, completed: 15 },
        requests: { conceptPack: 20, titaniumPack: 15 },
        contacts: { total: 40, new: 12 },
        galleryImages: {
          modoola: 25,
          machineExchange: 18,
          titaniumLaser: 22,
          projects: 30,
        },
      });

      // Verify all counts
      expect(mockPrismaService.mandate.count).toHaveBeenCalledTimes(5);
      expect(mockPrismaService.booking.count).toHaveBeenCalledTimes(4);
      expect(mockPrismaService.request.count).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.contact.count).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.gallery.count).toHaveBeenCalledTimes(4);
    });

    it('should call count with correct filters for mandate stats', async () => {
      mockPrismaService.mandate.count.mockResolvedValue(0);
      mockPrismaService.booking.count.mockResolvedValue(0);
      mockPrismaService.request.count.mockResolvedValue(0);
      mockPrismaService.contact.count.mockResolvedValue(0);
      mockPrismaService.gallery.count.mockResolvedValue(0);

      await service.getDashboardStats();

      expect(mockPrismaService.mandate.count).toHaveBeenCalledWith(); // total
      expect(mockPrismaService.mandate.count).toHaveBeenCalledWith({
        where: { status: Status.NEW },
      });
      expect(mockPrismaService.mandate.count).toHaveBeenCalledWith({
        where: { status: Status.REVIEWING },
      });
      expect(mockPrismaService.mandate.count).toHaveBeenCalledWith({
        where: { status: Status.CONTACTED },
      });
      expect(mockPrismaService.mandate.count).toHaveBeenCalledWith({
        where: { status: Status.CLOSED },
      });
    });

    it('should call count with correct filters for gallery stats', async () => {
      mockPrismaService.mandate.count.mockResolvedValue(0);
      mockPrismaService.booking.count.mockResolvedValue(0);
      mockPrismaService.request.count.mockResolvedValue(0);
      mockPrismaService.contact.count.mockResolvedValue(0);
      mockPrismaService.gallery.count.mockResolvedValue(0);

      await service.getDashboardStats();

      expect(mockPrismaService.gallery.count).toHaveBeenCalledWith({
        where: { productType: ProductType.MODOOLA },
      });
      expect(mockPrismaService.gallery.count).toHaveBeenCalledWith({
        where: { productType: ProductType.MACHINE_EXCHANGE },
      });
      expect(mockPrismaService.gallery.count).toHaveBeenCalledWith({
        where: { productType: ProductType.TITANIUM_LASER },
      });
      expect(mockPrismaService.gallery.count).toHaveBeenCalledWith({
        where: { productType: ProductType.PROJECTS },
      });
    });
  });
});
