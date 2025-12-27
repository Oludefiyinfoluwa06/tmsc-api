import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

// Mock the PrismaPg adapter and PrismaClient
jest.mock('@prisma/adapter-pg');
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      $connect = jest.fn();
      $disconnect = jest.fn();
    },
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  const originalEnv = process.env;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Set up environment variable
    process.env = {
      ...originalEnv,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw error when DATABASE_URL is not defined', () => {
      process.env.DATABASE_URL = '';

      expect(() => {
        new PrismaService();
      }).toThrow('DATABASE_URL environment variable is not defined');
    });

    it('should not throw when DATABASE_URL is defined', () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';

      expect(() => {
        new PrismaService();
      }).not.toThrow();
    });
  });

  describe('onModuleInit', () => {
    it('should connect to database on module init', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });

    it('should log success message on successful connection', async () => {
      const loggerSpy = jest.spyOn(service['logger'], 'log');
      jest.spyOn(service, '$connect').mockResolvedValue();

      await service.onModuleInit();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Successfully connected to the database',
      );
    });

    it('should log error and rethrow on connection failure', async () => {
      const error = new Error('Connection failed');
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      jest.spyOn(service, '$connect').mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to connect to the database',
      );
      expect(loggerErrorSpy).toHaveBeenCalledWith('Connection failed');
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database on module destroy', async () => {
      const disconnectSpy = jest
        .spyOn(service, '$disconnect')
        .mockResolvedValue();

      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
