import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Request, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: Prisma.RequestCreateInput): Promise<Request> {
    const request = await this.prisma.request.create({ data });
    this.eventEmitter.emit('request.created', request);
    return request;
  }

  async findAll(): Promise<Request[]> {
    return this.prisma.request.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Request | null> {
    return this.prisma.request.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: Status): Promise<Request> {
    return this.prisma.request.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<Request> {
    return this.prisma.request.delete({ where: { id } });
  }
}
