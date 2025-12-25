import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contact, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ContactService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(data: Prisma.ContactCreateInput): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    findOne(id: string): Promise<Contact | null>;
    updateStatus(id: string, status: Status): Promise<Contact>;
    remove(id: string): Promise<Contact>;
}
