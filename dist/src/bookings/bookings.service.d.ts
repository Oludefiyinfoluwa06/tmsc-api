import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking, Status } from '@prisma/client';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.BookingCreateInput): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking | null>;
    updateStatus(id: string, status: Status): Promise<Booking>;
    remove(id: string): Promise<Booking>;
}
