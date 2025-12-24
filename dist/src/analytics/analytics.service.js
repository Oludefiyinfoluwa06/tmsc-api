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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [mandates, bookings, requests, contacts, galleryImages] = await Promise.all([
            this.getMandateStats(),
            this.getBookingStats(),
            this.getRequestStats(),
            this.getContactStats(),
            this.getGalleryStats(),
        ]);
        return {
            mandates,
            bookings,
            requests,
            contacts,
            galleryImages,
        };
    }
    async getMandateStats() {
        const total = await this.prisma.mandate.count();
        const newMandates = await this.prisma.mandate.count({ where: { status: client_1.Status.NEW } });
        const reviewing = await this.prisma.mandate.count({ where: { status: client_1.Status.REVIEWING } });
        const contacted = await this.prisma.mandate.count({ where: { status: client_1.Status.CONTACTED } });
        const closed = await this.prisma.mandate.count({ where: { status: client_1.Status.CLOSED } });
        return { total, new: newMandates, reviewing, contacted, closed };
    }
    async getBookingStats() {
        const total = await this.prisma.booking.count();
        const newBookings = await this.prisma.booking.count({ where: { status: client_1.Status.NEW } });
        const confirmed = await this.prisma.booking.count({ where: { status: client_1.Status.CONFIRMED } });
        const completed = await this.prisma.booking.count({ where: { status: client_1.Status.COMPLETED } });
        return { total, new: newBookings, confirmed, completed };
    }
    async getRequestStats() {
        const conceptPack = await this.prisma.request.count({ where: { type: 'CONCEPT_PACK' } });
        const titaniumPack = await this.prisma.request.count({ where: { type: 'TITANIUM_PACK' } });
        return { conceptPack, titaniumPack };
    }
    async getContactStats() {
        const total = await this.prisma.contact.count();
        const newContacts = await this.prisma.contact.count({ where: { status: client_1.Status.NEW } });
        return { total, new: newContacts };
    }
    async getGalleryStats() {
        const modoola = await this.prisma.gallery.count({ where: { productType: client_1.ProductType.MODOOLA } });
        const machineExchange = await this.prisma.gallery.count({ where: { productType: client_1.ProductType.MACHINE_EXCHANGE } });
        const titaniumLaser = await this.prisma.gallery.count({ where: { productType: client_1.ProductType.TITANIUM_LASER } });
        const projects = await this.prisma.gallery.count({ where: { productType: client_1.ProductType.PROJECTS } });
        return { modoola, machineExchange, titaniumLaser, projects };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map