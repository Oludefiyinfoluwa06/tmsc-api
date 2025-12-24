import { GalleryService } from './gallery.service';
import { Prisma } from '@prisma/client';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    getPublicGallery(productType: string, groupId?: string): Promise<{
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
    getAdminGallery(productType: string, groupId?: string): Promise<{
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
    create(productType: string, data: Omit<Prisma.GalleryCreateInput, 'productType' | 'group'> & {
        groupId?: string;
    }): Promise<{
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
    }>;
    update(id: string, data: Omit<Prisma.GalleryUpdateInput, 'group'> & {
        groupId?: string;
    }): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
        imageUrl: string;
        caption: string | null;
        description: string | null;
        order: number;
        groupId: string | null;
    }[]>;
}
