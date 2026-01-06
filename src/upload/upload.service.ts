import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export enum UploadFolder {
  BRIEFS = 'briefs',
  GALLERY = 'gallery',
  MODULAR_CENTERS = 'modular-centers',
}

@Injectable()
export class UploadService {
  private static getBaseUploadPath(): string {
    return process.env.VERCEL
      ? join('/tmp', 'uploads')
      : join(process.cwd(), 'uploads');
  }

  private readonly uploadPath = UploadService.getBaseUploadPath();

  constructor() {
    this.ensureUploadDirs();
  }

  private ensureUploadDirs() {
    const baseUploadPath = UploadService.getBaseUploadPath();
    // Ensure base upload path exists
    if (!existsSync(baseUploadPath)) {
      mkdirSync(baseUploadPath, { recursive: true });
    }

    // Ensure all subdirectories exist
    Object.values(UploadFolder).forEach((folder) => {
      const folderPath = join(baseUploadPath, folder);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }
    });
  }

  static getUploadPath(folder: UploadFolder): string {
    return join(this.getBaseUploadPath(), folder);
  }

  static getUploadUrl(folder: UploadFolder, filename: string): string {
    return `/uploads/${folder}/${filename}`;
  }

  getUploadUrl(folder: UploadFolder, filename: string): string {
    return UploadService.getUploadUrl(folder, filename);
  }

  getFilePath(filename: string): string {
    return join(this.uploadPath, filename);
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
