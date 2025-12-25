import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Request, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class RequestsService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(data: Prisma.RequestCreateInput): Promise<Request>;
    findAll(): Promise<Request[]>;
    findOne(id: string): Promise<Request | null>;
    updateStatus(id: string, status: Status): Promise<Request>;
    remove(id: string): Promise<Request>;
}
