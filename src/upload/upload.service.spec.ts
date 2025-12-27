import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

jest.mock('fs');

describe('UploadService', () => {
  let service: UploadService;

  const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
  const mockMkdirSync = mkdirSync as jest.MockedFunction<typeof mkdirSync>;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Default: directory exists
    mockExistsSync.mockReturnValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should create upload directory if it does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      // Create a new instance
      new UploadService();

      const expectedPath = join(process.cwd(), 'uploads');
      expect(mockExistsSync).toHaveBeenCalledWith(expectedPath);
      expect(mockMkdirSync).toHaveBeenCalledWith(expectedPath, {
        recursive: true,
      });
    });

    it('should not create upload directory if it already exists', () => {
      mockExistsSync.mockReturnValue(true);
      mockMkdirSync.mockClear();

      // Create a new instance
      new UploadService();

      expect(mockExistsSync).toHaveBeenCalled();
      expect(mockMkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getFilePath', () => {
    it('should return correct file path', () => {
      const filename = 'test-file.pdf';
      const expectedPath = join(process.cwd(), 'uploads', filename);

      const result = service.getFilePath(filename);

      expect(result).toBe(expectedPath);
    });

    it('should handle different filenames', () => {
      const filename = 'document-2024.docx';
      const expectedPath = join(process.cwd(), 'uploads', filename);

      const result = service.getFilePath(filename);

      expect(result).toBe(expectedPath);
    });
  });

  describe('getFileUrl', () => {
    it('should return correct file URL', () => {
      const filename = 'test-file.pdf';
      const expectedUrl = '/uploads/test-file.pdf';

      const result = service.getFileUrl(filename);

      expect(result).toBe(expectedUrl);
    });

    it('should handle filenames with special characters', () => {
      const filename = 'test file (1).pdf';
      const expectedUrl = '/uploads/test file (1).pdf';

      const result = service.getFileUrl(filename);

      expect(result).toBe(expectedUrl);
    });
  });
});
