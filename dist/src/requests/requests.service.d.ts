import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Request, Status } from '@prisma/client';
export declare class RequestsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.RequestCreateInput): Promise<Request>;
    findAll(): Promise<Request[]>;
    findOne(id: string): Promise<Request | null>;
    updateStatus(id: string, status: Status): Promise<Request>;
    remove(id: string): Promise<Request>;
}
