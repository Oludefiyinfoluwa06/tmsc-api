import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [mandates, bookings, requests, contacts, galleryImages] =
      await Promise.all([
        this.getMandateStats(),
        this.getBookingStats(),
        this.getRequestStats(),
        this.getContactStats(),
        this.getGalleryStats(),
      ]);

    return {
      mandates,
      bookings,
      requests,
      contacts,
      galleryImages,
    };
  }

  private async getMandateStats() {
    const total = await this.prisma.mandate.count();
    const newMandates = await this.prisma.mandate.count({
      where: { status: Status.NEW },
    });
    const reviewing = await this.prisma.mandate.count({
      where: { status: Status.REVIEWING },
    });
    const contacted = await this.prisma.mandate.count({
      where: { status: Status.CONTACTED },
    });
    const closed = await this.prisma.mandate.count({
      where: { status: Status.CLOSED },
    });

    return { total, new: newMandates, reviewing, contacted, closed };
  }

  private async getBookingStats() {
    const total = await this.prisma.booking.count();
    const newBookings = await this.prisma.booking.count({
      where: { status: Status.NEW },
    });
    const confirmed = await this.prisma.booking.count({
      where: { status: Status.CONFIRMED },
    });
    const completed = await this.prisma.booking.count({
      where: { status: Status.COMPLETED },
    });

    return { total, new: newBookings, confirmed, completed };
  }

  private async getRequestStats() {
    const conceptPack = await this.prisma.request.count({
      where: { type: 'CONCEPT_PACK' },
    });
    const titaniumPack = await this.prisma.request.count({
      where: { type: 'TITANIUM_PACK' },
    });

    return { conceptPack, titaniumPack };
  }

  private async getContactStats() {
    const total = await this.prisma.contact.count();
    const newContacts = await this.prisma.contact.count({
      where: { status: Status.NEW },
    });

    return { total, new: newContacts };
  }

  private async getGalleryStats() {
    const total = await this.prisma.gallery.count();
    return { total };
  }
}
