import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking, Status } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return this.prisma.booking.create({ data });
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
