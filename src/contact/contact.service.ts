import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contact, Status } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    return this.prisma.contact.create({ data });
  }

  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: Status): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<Contact> {
    return this.prisma.contact.delete({ where: { id } });
  }
}
