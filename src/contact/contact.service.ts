import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contact, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    const contact = await this.prisma.contact.create({ data });
    this.eventEmitter.emit('contact.created', contact);
    return contact;
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
