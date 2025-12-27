import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';

describe('SeedService', () => {
  let service: SeedService;

  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    password: 'hashedPassword',
    name: 'Super Administrator',
    role: Role.SUPER_ADMIN,
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);

    jest.clearAllMocks();
    // Setup environment variables
    process.env.SUPER_ADMIN_EMAIL = 'admin@example.com';
    process.env.SUPER_ADMIN_PASSWORD = 'SuperSecurePassword123!';
    process.env.SUPER_ADMIN_NAME = 'Super Administrator';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seedSuperAdmin', () => {
    it('should create super admin when none exists', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      await service.seedSuperAdmin();

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        'admin@example.com',
      );
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'SuperSecurePassword123!',
        name: 'Super Administrator',
        role: Role.SUPER_ADMIN,
        isActive: true,
      });
    });

    it('should not create  super admin when one already exists', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await service.seedSuperAdmin();

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        'admin@example.com',
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should use environment variables for credentials', async () => {
      process.env.SUPER_ADMIN_EMAIL = 'custom@example.com';
      process.env.SUPER_ADMIN_PASSWORD = 'CustomPassword456!';
      process.env.SUPER_ADMIN_NAME = 'Custom Admin';

      mockUsersService.findOne.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      await service.seedSuperAdmin();

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        'custom@example.com',
      );
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'custom@example.com',
        password: 'CustomPassword456!',
        name: 'Custom Admin',
        role: Role.SUPER_ADMIN,
        isActive: true,
      });
    });

    it('should use default values when environment variables are not set', async () => {
      delete process.env.SUPER_ADMIN_EMAIL;
      delete process.env.SUPER_ADMIN_PASSWORD;
      delete process.env.SUPER_ADMIN_NAME;

      mockUsersService.findOne.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      await service.seedSuperAdmin();

      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'SuperSecurePassword123!',
        name: 'Super Administrator',
        role: Role.SUPER_ADMIN,
        isActive: true,
      });
    });

    it('should throw error when seeding fails', async () => {
      const error = new Error('Database error');
      mockUsersService.findOne.mockRejectedValue(error);

      await expect(service.seedSuperAdmin()).rejects.toThrow('Database error');
    });
  });
});
