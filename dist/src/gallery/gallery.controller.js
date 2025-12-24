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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const gallery_service_1 = require("./gallery.service");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let GalleryController = class GalleryController {
    galleryService;
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    getPublicGallery(productType, groupId) {
        const type = productType.toUpperCase().replace('-', '_');
        return this.galleryService.findAllPublic(type, groupId);
    }
    getAdminGallery(productType, groupId) {
        const type = productType.toUpperCase().replace('-', '_');
        return this.galleryService.findAllAdmin(type, groupId);
    }
    create(productType, data) {
        const type = productType.toUpperCase().replace('-', '_');
        const { groupId, ...rest } = data;
        const createData = {
            ...rest,
            productType: type,
        };
        if (groupId) {
            createData.group = { connect: { id: groupId } };
        }
        return this.galleryService.create(createData);
    }
    update(id, data) {
        const { groupId, ...rest } = data;
        const updateData = {
            ...rest,
        };
        if (groupId) {
            updateData.group = { connect: { id: groupId } };
        }
        else if (groupId === null) {
            updateData.group = { disconnect: true };
        }
        return this.galleryService.update(id, updateData);
    }
    remove(id) {
        return this.galleryService.remove(id);
    }
    reorder(items) {
        return this.galleryService.reorder(items);
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Get)('gallery/:productType'),
    __param(0, (0, common_1.Param)('productType')),
    __param(1, (0, common_1.Query)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getPublicGallery", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.GALLERY_ADMIN),
    (0, common_1.Get)('admin/gallery/:productType'),
    __param(0, (0, common_1.Param)('productType')),
    __param(1, (0, common_1.Query)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getAdminGallery", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.GALLERY_ADMIN),
    (0, common_1.Post)('admin/gallery/:productType'),
    __param(0, (0, common_1.Param)('productType')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.GALLERY_ADMIN),
    (0, common_1.Put)('admin/gallery/:imageId'),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.GALLERY_ADMIN),
    (0, common_1.Delete)('admin/gallery/:imageId'),
    __param(0, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.GALLERY_ADMIN),
    (0, common_1.Patch)('admin/gallery/reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "reorder", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map