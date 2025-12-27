import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { Notification, NotificationType } from '@prisma/client';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockNotification: Notification = {
    id: '1',
    type: NotificationType.SYSTEM,
    title: 'Test Notification',
    message: 'Test Message',
    link: '/path/to/resource',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createDto = {
        type: NotificationType.SYSTEM,
        title: 'New Notification',
        message: 'New Message',
        link: '/new/path',
      };

      mockPrismaService.notification.create.mockResolvedValue({
        ...mockNotification,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(mockPrismaService.notification.create).toHaveBeenCalled();
      expect(result.title).toBe('New Notification');
    });
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const notifications = [mockNotification];
      mockPrismaService.notification.findMany.mockResolvedValue(notifications);

      const result = await service.findAll();

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(notifications);
    });
  });

  describe('findUnread', () => {
    it('should return unread notifications', async () => {
      const unreadNotifications = [mockNotification];
      mockPrismaService.notification.findMany.mockResolvedValue(
        unreadNotifications,
      );

      const result = await service.findUnread();

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(unreadNotifications);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockPrismaService.notification.update.mockResolvedValue({
        ...mockNotification,
        isRead: true,
      });

      const result = await service.markAsRead('1');

      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isRead: true },
      });
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      await service.markAllAsRead();

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { isRead: false },
        data: { isRead: true },
      });
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      mockPrismaService.notification.delete.mockResolvedValue(mockNotification);

      const result = await service.remove('1');

      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('clearAll', () => {
    it('should delete all notifications', async () => {
      mockPrismaService.notification.deleteMany.mockResolvedValue({
        count: 10,
      });

      await service.clearAll();

      expect(mockPrismaService.notification.deleteMany).toHaveBeenCalled();
    });
  });
});
