import { ContactService } from './contact.service';
import { Status, Prisma } from '@prisma/client';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submit(data: Prisma.ContactCreateInput): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string | null;
        message: string;
        briefFileUrl: string | null;
        status: import("@prisma/client").$Enums.Status;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string | null;
        message: string;
        briefFileUrl: string | null;
        status: import("@prisma/client").$Enums.Status;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string | null;
        message: string;
        briefFileUrl: string | null;
        status: import("@prisma/client").$Enums.Status;
    } | null>;
    updateStatus(id: string, status: Status): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string | null;
        message: string;
        briefFileUrl: string | null;
        status: import("@prisma/client").$Enums.Status;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        audienceType: string;
        phone: string;
        organization: string | null;
        message: string;
        briefFileUrl: string | null;
        status: import("@prisma/client").$Enums.Status;
    }>;
}
