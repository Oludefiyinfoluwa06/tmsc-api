import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStats(): Promise<{
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
}
