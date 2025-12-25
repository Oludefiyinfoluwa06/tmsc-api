import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Mandate, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MandatesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: Prisma.MandateCreateInput): Promise<Mandate> {
    const mandate = await this.prisma.mandate.create({ data });
    this.eventEmitter.emit('mandate.created', mandate);
    return mandate;
  }

  async findAll(): Promise<Mandate[]> {
    return this.prisma.mandate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Mandate | null> {
    return this.prisma.mandate.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: Status): Promise<Mandate> {
    return this.prisma.mandate.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<Mandate> {
    return this.prisma.mandate.delete({ where: { id } });
  }
}
