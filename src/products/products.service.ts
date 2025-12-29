import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: {
        ...data,
      },
    });
  }

  async findAllAdmin(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findAllPublic(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        groups: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            images: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        groups: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            images: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    if (!product)
      throw new NotFoundException(`Product with slug ${slug} not found`);
    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Product> {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; order: number }[]) {
    return await Promise.all(
      items.map((item) =>
        this.prisma.product.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }
}
