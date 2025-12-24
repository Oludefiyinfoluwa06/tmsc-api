export declare class UploadService {
    private readonly uploadPath;
    constructor();
    private ensureUploadDir;
    getFilePath(filename: string): string;
    getFileUrl(filename: string): string;
}
