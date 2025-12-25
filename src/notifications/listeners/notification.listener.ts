import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { NotificationsGateway } from '../notifications.gateway';
import { NotificationType } from '@prisma/client';
import type { Contact, Booking, Request, Mandate } from '@prisma/client';

@Injectable()
export class NotificationEventListener {
  private readonly logger = new Logger(NotificationEventListener.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @OnEvent('contact.created')
  async handleContactCreatedEvent(payload: Contact) {
    this.logger.log(`Handling contact.created event for: ${payload.name}`);
    const notification = await this.notificationsService.create({
      type: NotificationType.CONTACT,
      title: 'New Contact Enquiry',
      message: `New message from ${payload.name} (${payload.email})`,
      link: `/admin/contacts/${payload.id}`,
    });
    this.notificationsGateway.sendNotification(notification);
  }

  @OnEvent('booking.created')
  async handleBookingCreatedEvent(payload: Booking) {
    this.logger.log(`Handling booking.created event for: ${payload.name}`);
    const notification = await this.notificationsService.create({
      type: NotificationType.BOOKING,
      title: 'New Strategy Call Booking',
      message: `${payload.name} booked a call for ${payload.preferredDate.toISOString()}`,
      link: `/admin/bookings/${payload.id}`,
    });
    this.notificationsGateway.sendNotification(notification);
  }

  @OnEvent('request.created')
  async handleRequestCreatedEvent(payload: Request) {
    this.logger.log(`Handling request.created event for: ${payload.name}`);
    const notification = await this.notificationsService.create({
      type: NotificationType.REQUEST,
      title: 'New Pack Request',
      message: `${payload.name} requested a ${payload.type}`,
      link: `/admin/requests/${payload.id}`,
    });
    this.notificationsGateway.sendNotification(notification);
  }

  @OnEvent('mandate.created')
  async handleMandateCreatedEvent(payload: Mandate) {
    this.logger.log(`Handling mandate.created event for: ${payload.name}`);
    const notification = await this.notificationsService.create({
      type: NotificationType.MANDATE,
      title: 'New Mandate Submitted',
      message: `New mandate from ${payload.organization} by ${payload.name}`,
      link: `/admin/mandates/${payload.id}`,
    });
    this.notificationsGateway.sendNotification(notification);
  }
}
