import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Mandate, Status } from '@prisma/client';
export declare class MandatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.MandateCreateInput): Promise<Mandate>;
    findAll(): Promise<Mandate[]>;
    findOne(id: string): Promise<Mandate | null>;
    updateStatus(id: string, status: Status): Promise<Mandate>;
    remove(id: string): Promise<Mandate>;
}
