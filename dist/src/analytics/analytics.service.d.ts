import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        mandates: {
            total: number;
            new: number;
            reviewing: number;
            contacted: number;
            closed: number;
        };
        bookings: {
            total: number;
            new: number;
            confirmed: number;
            completed: number;
        };
        requests: {
            conceptPack: number;
            titaniumPack: number;
        };
        contacts: {
            total: number;
            new: number;
        };
        galleryImages: {
            modoola: number;
            machineExchange: number;
            titaniumLaser: number;
            projects: number;
        };
    }>;
    private getMandateStats;
    private getBookingStats;
    private getRequestStats;
    private getContactStats;
    private getGalleryStats;
}
