import { RequestsService } from './requests.service';
import { Status, Prisma } from '@prisma/client';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    requestConceptPack(data: Omit<Prisma.RequestCreateInput, 'type'>): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        type: import("@prisma/client").$Enums.RequestType;
        company: string;
    }>;
    requestTitaniumPack(data: Omit<Prisma.RequestCreateInput, 'type'>): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        type: import("@prisma/client").$Enums.RequestType;
        company: string;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        type: import("@prisma/client").$Enums.RequestType;
        company: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        type: import("@prisma/client").$Enums.RequestType;
        company: string;
    } | null>;
    updateStatus(id: string, status: Status): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        type: import("@prisma/client").$Enums.RequestType;
        company: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        message: string | null;
        status: import("@prisma/client").$Enums.Status;
        type: import("@prisma/client").$Enums.RequestType;
        company: string;
    }>;
}
