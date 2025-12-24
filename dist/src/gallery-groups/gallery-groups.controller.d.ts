import { GalleryGroupsService } from './gallery-groups.service';
import { ProductType, Prisma } from '@prisma/client';
export declare class GalleryGroupsController {
    private readonly galleryGroupsService;
    constructor(galleryGroupsService: GalleryGroupsService);
    getPublicGroups(productType: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }[]>;
    findAll(productType?: ProductType): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }[]>;
    create(data: Prisma.GalleryGroupCreateInput): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }>;
    update(id: string, data: Prisma.GalleryGroupUpdateInput): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productType: import("@prisma/client").$Enums.ProductType;
        description: string | null;
        order: number;
        title: string;
    }>;
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
