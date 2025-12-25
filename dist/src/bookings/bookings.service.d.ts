import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class BookingsService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(data: Prisma.BookingCreateInput): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking | null>;
    updateStatus(id: string, status: Status): Promise<Booking>;
    remove(id: string): Promise<Booking>;
}
