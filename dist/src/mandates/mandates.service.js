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
exports.MandatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let MandatesService = class MandatesService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async create(data) {
        const mandate = await this.prisma.mandate.create({ data });
        this.eventEmitter.emit('mandate.created', mandate);
        return mandate;
    }
    async findAll() {
        return this.prisma.mandate.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        return this.prisma.mandate.findUnique({ where: { id } });
    }
    async updateStatus(id, status) {
        return this.prisma.mandate.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        return this.prisma.mandate.delete({ where: { id } });
    }
};
exports.MandatesService = MandatesService;
exports.MandatesService = MandatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], MandatesService);
//# sourceMappingURL=mandates.service.js.map