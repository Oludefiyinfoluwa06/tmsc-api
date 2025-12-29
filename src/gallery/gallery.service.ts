import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Gallery } from '@prisma/client';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(
    productSlug: string,
    groupId?: string | null,
  ): Promise<Gallery[]> {
    const product = await this.prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!product) return [];

    const where: Prisma.GalleryWhereInput = {
      productId: product.id,
      isActive: true,
    };

    if (groupId) {
      where.groupId = groupId;
    } else if (groupId === null) {
      where.groupId = { equals: null };
    }

    return await this.prisma.gallery.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin(
    productId: string,
    groupId?: string | null,
  ): Promise<Gallery[]> {
    const where: Prisma.GalleryWhereInput = {
      productId,
    };

    if (groupId) {
      where.groupId = groupId;
    }

    return await this.prisma.gallery.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async create(data: Prisma.GalleryCreateInput): Promise<Gallery> {
    return await this.prisma.gallery.create({ data });
  }

  async findOne(id: string): Promise<Gallery | null> {
    return await this.prisma.gallery.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.GalleryUpdateInput): Promise<Gallery> {
    return await this.prisma.gallery.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Gallery> {
    return await this.prisma.gallery.delete({ where: { id } });
  }

  async reorder(items: { id: string; order: number }[]) {
    return await Promise.all(
      items.map((item) =>
        this.prisma.gallery.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }
}
