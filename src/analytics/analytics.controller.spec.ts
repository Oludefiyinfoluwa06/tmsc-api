import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockDashboardStats = {
    mandates: { total: 50, new: 10, reviewing: 15, contacted: 20, closed: 5 },
    bookings: { total: 30, new: 5, confirmed: 10, completed: 15 },
    requests: { conceptPack: 20, titaniumPack: 15 },
    contacts: { total: 40, new: 12 },
    galleryImages: {
      modoola: 25,
      machineExchange: 18,
      titaniumLaser: 22,
      projects: 30,
    },
  };

  const mockAnalyticsService = {
    getDashboardStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      mockAnalyticsService.getDashboardStats.mockResolvedValue(
        mockDashboardStats,
      );

      const result = await controller.getStats();

      expect(mockAnalyticsService.getDashboardStats).toHaveBeenCalled();
      expect(result).toEqual(mockDashboardStats);
      expect(result.mandates.total).toBe(50);
      expect(result.bookings.new).toBe(5);
      expect(result.galleryImages.modoola).toBe(25);
    });

    it('should return complete stats structure', async () => {
      mockAnalyticsService.getDashboardStats.mockResolvedValue(
        mockDashboardStats,
      );

      const result = await controller.getStats();

      expect(result).toHaveProperty('mandates');
      expect(result).toHaveProperty('bookings');
      expect(result).toHaveProperty('requests');
      expect(result).toHaveProperty('contacts');
      expect(result).toHaveProperty('galleryImages');
    });
  });
});
