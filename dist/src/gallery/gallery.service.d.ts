import { PrismaService } from '../prisma/prisma.service';
import { ProductType, Prisma, Gallery } from '@prisma/client';
export declare class GalleryService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllPublic(productType: ProductType, groupId?: string): Promise<Gallery[]>;
    findAllAdmin(productType: ProductType, groupId?: string): Promise<Gallery[]>;
    create(data: Prisma.GalleryCreateInput): Promise<Gallery>;
    findOne(id: string): Promise<Gallery | null>;
    update(id: string, data: Prisma.GalleryUpdateInput): Promise<Gallery>;
    remove(id: string): Promise<Gallery>;
    reorder(items: {
        id: string;
        order: number;
    }[]): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        imageUrl: string;
        caption: string | null;
        description: string | null;
        order: number;
        groupId: string | null;
    }[]>;
}
