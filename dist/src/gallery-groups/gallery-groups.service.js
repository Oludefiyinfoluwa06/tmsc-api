"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryGroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GalleryGroupsService = class GalleryGroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return await this.prisma.galleryGroup.create({
            data,
        });
    }
    async findAll(productType) {
        return await this.prisma.galleryGroup.findMany({
            where: productType ? { productType, isActive: true } : { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                images: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async findOne(id) {
        const group = await this.prisma.galleryGroup.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!group)
            throw new common_1.NotFoundException(`Gallery group with ID ${id} not found`);
        return group;
    }
    async update(id, data) {
        return await this.prisma.galleryGroup.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return await this.prisma.galleryGroup.delete({
            where: { id },
        });
    }
    async reorder(items) {
        return await Promise.all(items.map((item) => this.prisma.galleryGroup.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
    }
};
exports.GalleryGroupsService = GalleryGroupsService;
exports.GalleryGroupsService = GalleryGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryGroupsService);
//# sourceMappingURL=gallery-groups.service.js.map