import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    const booking = await this.prisma.booking.create({ data });
    this.eventEmitter.emit('booking.created', booking);
    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Booking | null> {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: Status): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<Booking> {
    return this.prisma.booking.delete({ where: { id } });
  }
}
