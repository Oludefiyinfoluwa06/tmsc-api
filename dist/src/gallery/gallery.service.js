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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GalleryService = class GalleryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllPublic(productType, groupId) {
        const where = {
            productType,
            isActive: true,
        };
        if (groupId) {
            where.groupId = groupId;
        }
        else if (groupId === null) {
            where.groupId = { equals: null };
        }
        return await this.prisma.gallery.findMany({
            where,
            orderBy: { order: 'asc' },
        });
    }
    async findAllAdmin(productType, groupId) {
        const where = {
            productType,
        };
        if (groupId) {
            where.groupId = groupId;
        }
        return await this.prisma.gallery.findMany({
            where,
            orderBy: { order: 'asc' },
        });
    }
    async create(data) {
        return await this.prisma.gallery.create({ data });
    }
    async findOne(id) {
        return await this.prisma.gallery.findUnique({ where: { id } });
    }
    async update(id, data) {
        return await this.prisma.gallery.update({ where: { id }, data });
    }
    async remove(id) {
        return await this.prisma.gallery.delete({ where: { id } });
    }
    async reorder(items) {
        return await Promise.all(items.map((item) => this.prisma.gallery.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map