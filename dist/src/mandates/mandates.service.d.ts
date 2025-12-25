import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Mandate, Status } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class MandatesService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(data: Prisma.MandateCreateInput): Promise<Mandate>;
    findAll(): Promise<Mandate[]>;
    findOne(id: string): Promise<Mandate | null>;
    updateStatus(id: string, status: Status): Promise<Mandate>;
    remove(id: string): Promise<Mandate>;
}
