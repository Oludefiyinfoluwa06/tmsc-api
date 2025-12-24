import { BookingsService } from './bookings.service';
import { Status, Prisma } from '@prisma/client';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    book(data: Prisma.BookingCreateInput): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        preferredDate: Date;
        preferredTime: string;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        preferredDate: Date;
        preferredTime: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        preferredDate: Date;
        preferredTime: string;
    } | null>;
    updateStatus(id: string, status: Status): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        preferredDate: Date;
        preferredTime: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        preferredDate: Date;
        preferredTime: string;
    }>;
}
