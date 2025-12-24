import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Mandate, Status } from '@prisma/client';

@Injectable()
export class MandatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MandateCreateInput): Promise<Mandate> {
    return this.prisma.mandate.create({ data });
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
