import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateModularCenterDto,
  UpdateModularCenterDto,
  AddCenterImageDto,
  UpdateCenterImageDto,
} from './modular-centers.dto';

@Injectable()
export class ModularCentersService {
  constructor(private prisma: PrismaService) {}

  // Centers
  async findAllPublic() {
    return this.prisma.modularCenter.findMany({
      where: { isActive: true },
      include: {
        images: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.modularCenter.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const center = await this.prisma.modularCenter.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!center) throw new NotFoundException(`Center with ID ${id} not found`);
    return center;
  }

  async create(data: CreateModularCenterDto) {
    return this.prisma.modularCenter.create({
      data,
    });
  }

  async update(id: string, data: UpdateModularCenterDto) {
    return this.prisma.modularCenter.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.modularCenter.delete({
      where: { id },
    });
  }

  async reorder(ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.modularCenter.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );
  }

  // Images
  async addImage(centerId: string, data: AddCenterImageDto) {
    // Ensure center exists
    await this.findOne(centerId);
    return this.prisma.centerImage.create({
      data: {
        ...data,
        centerId,
      },
    });
  }

  async updateImage(imageId: string, data: UpdateCenterImageDto) {
    return this.prisma.centerImage.update({
      where: { id: imageId },
      data,
    });
  }

  async removeImage(imageId: string) {
    return this.prisma.centerImage.delete({
      where: { id: imageId },
    });
  }

  async reorderImages(centerId: string, ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.centerImage.update({
          where: { id, centerId },
          data: { order: index },
        }),
      ),
    );
  }
}
