import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFilePath(filename: string): string {
    return join(this.uploadPath, filename);
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
