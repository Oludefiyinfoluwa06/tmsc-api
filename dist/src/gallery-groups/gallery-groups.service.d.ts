import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductType, GalleryGroup } from '@prisma/client';
export declare class GalleryGroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.GalleryGroupCreateInput): Promise<GalleryGroup>;
    findAll(productType?: ProductType): Promise<GalleryGroup[]>;
    findOne(id: string): Promise<GalleryGroup>;
    update(id: string, data: Prisma.GalleryGroupUpdateInput): Promise<GalleryGroup>;
    remove(id: string): Promise<GalleryGroup>;
    reorder(items: {
        id: string;
        order: number;
    }[]): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }[]>;
}
