import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationEventListener } from './listeners/notification.listener';

@Global()
@Module({
  providers: [
    NotificationsService,
    NotificationsGateway,
    NotificationEventListener,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
