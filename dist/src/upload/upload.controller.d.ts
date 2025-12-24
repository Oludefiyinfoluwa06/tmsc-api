import { UploadService } from './upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadBrief(file: Express.Multer.File): {
        url: string;
        filename: string;
    };
    uploadGallery(files: Array<Express.Multer.File>): {
        url: string;
        filename: string;
    }[];
}
