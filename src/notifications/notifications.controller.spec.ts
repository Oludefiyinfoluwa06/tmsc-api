import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '@prisma/client';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockNotification = {
    id: '1',
    type: NotificationType.SYSTEM,
    title: 'Test Notification',
    message: 'Test Message',
    link: '/path/to/resource',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotificationsService = {
    findAll: jest.fn(),
    findUnread: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const notifications = [mockNotification];
      mockNotificationsService.findAll.mockResolvedValue(notifications);

      const result = await controller.findAll();

      expect(mockNotificationsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(notifications);
    });
  });

  describe('findUnread', () => {
    it('should return unread notifications', async () => {
      const unreadNotifications = [mockNotification];
      mockNotificationsService.findUnread.mockResolvedValue(
        unreadNotifications,
      );

      const result = await controller.findUnread();

      expect(mockNotificationsService.findUnread).toHaveBeenCalled();
      expect(result).toEqual(unreadNotifications);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockNotificationsService.markAsRead.mockResolvedValue({
        ...mockNotification,
        isRead: true,
      });

      const result = await controller.markAsRead('1');

      expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith('1');
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockNotificationsService.markAllAsRead.mockResolvedValue({ count: 5 });

      await controller.markAllAsRead();

      expect(mockNotificationsService.markAllAsRead).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      mockNotificationsService.remove.mockResolvedValue(mockNotification);

      const result = await controller.remove('1');

      expect(mockNotificationsService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockNotification);
    });
  });

  describe('clearAll', () => {
    it('should delete all notifications', async () => {
      mockNotificationsService.clearAll.mockResolvedValue({ count: 10 });

      await controller.clearAll();

      expect(mockNotificationsService.clearAll).toHaveBeenCalled();
    });
  });
});
