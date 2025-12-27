import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockUploadService = {
    getFilePath: jest.fn(),
    getFileUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadBrief', () => {
    it('should return uploaded brief file info', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        destination: './uploads/briefs',
        filename: 'abc123.pdf',
        path: './uploads/briefs/abc123.pdf',
        buffer: Buffer.from(''),
        stream: null,
      } as any;

      const result = controller.uploadBrief(mockFile);

      expect(result).toEqual({
        url: '/uploads/briefs/abc123.pdf',
        filename: 'abc123.pdf',
      });
    });

    it('should handle different file types', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'document.docx',
        encoding: '7bit',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 2048,
        destination: './uploads/briefs',
        filename: 'xyz789.docx',
        path: './uploads/briefs/xyz789.docx',
        buffer: Buffer.from(''),
        stream: null,
      } as any;

      const result = controller.uploadBrief(mockFile);

      expect(result.filename).toBe('xyz789.docx');
      expect(result.url).toContain('/uploads/briefs/');
    });
  });

  describe('uploadGallery', () => {
    it('should return uploaded gallery files info', () => {
      const mockFiles: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'image1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 1024,
          destination: './uploads/gallery',
          filename: 'abc123.jpg',
          path: './uploads/gallery/abc123.jpg',
          buffer: Buffer.from(''),
          stream: null,
        } as any,
        {
          fieldname: 'files',
          originalname: 'image2.png',
          encoding: '7bit',
          mimetype: 'image/png',
          size: 2048,
          destination: './uploads/gallery',
          filename: 'def456.png',
          path: './uploads/gallery/def456.png',
          buffer: Buffer.from(''),
          stream: null,
        } as any,
      ];

      const result = controller.uploadGallery(mockFiles);

      expect(result).toEqual([
        { url: '/uploads/gallery/abc123.jpg', filename: 'abc123.jpg' },
        { url: '/uploads/gallery/def456.png', filename: 'def456.png' },
      ]);
      expect(result.length).toBe(2);
    });

    it('should handle single file upload', () => {
      const mockFiles: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'photo.webp',
          encoding: '7bit',
          mimetype: 'image/webp',
          size: 512,
          destination: './uploads/gallery',
          filename: 'single123.webp',
          path: './uploads/gallery/single123.webp',
          buffer: Buffer.from(''),
          stream: null,
        } as any,
      ];

      const result = controller.uploadGallery(mockFiles);

      expect(result.length).toBe(1);
      expect(result[0].filename).toBe('single123.webp');
    });

    it('should handle empty files array', () => {
      const mockFiles: Express.Multer.File[] = [];

      const result = controller.uploadGallery(mockFiles);

      expect(result).toEqual([]);
    });
  });
});
