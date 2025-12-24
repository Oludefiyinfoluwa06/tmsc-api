import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Request, Status } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RequestCreateInput): Promise<Request> {
    return this.prisma.request.create({ data });
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
