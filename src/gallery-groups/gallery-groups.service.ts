import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, GalleryGroup } from '@prisma/client';

@Injectable()
export class GalleryGroupsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GalleryGroupCreateInput): Promise<GalleryGroup> {
    return await this.prisma.galleryGroup.create({
      data,
    });
  }

  async findAll(productId?: string): Promise<GalleryGroup[]> {
    return await this.prisma.galleryGroup.findMany({
      where: productId ? { productId, isActive: true } : { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        images: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAllPublic(): Promise<GalleryGroup[]> {
    return await this.prisma.galleryGroup.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        images: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: string): Promise<GalleryGroup> {
    const group = await this.prisma.galleryGroup.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!group)
      throw new NotFoundException(`Gallery group with ID ${id} not found`);
    return group;
  }

  async update(
    id: string,
    data: Prisma.GalleryGroupUpdateInput,
  ): Promise<GalleryGroup> {
    return await this.prisma.galleryGroup.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<GalleryGroup> {
    return await this.prisma.galleryGroup.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; order: number }[]) {
    return await Promise.all(
      items.map((item) =>
        this.prisma.galleryGroup.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }
}
