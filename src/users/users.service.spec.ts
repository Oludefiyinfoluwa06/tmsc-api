import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: Role.SUPER_ADMIN,
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createData = {
        email: 'new@example.com',
        password: 'plainPassword',
        name: 'New User',
        role: Role.GALLERY_ADMIN,
      };

      const hashedPassword = 'hashedPassword456';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...createData,
        password: hashedPassword,
      });

      const result = await service.create(createData);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          password: hashedPassword,
        },
      });
      expect(result.password).toBe(hashedPassword);
    });
  });

  describe('update', () => {
    it('should update user and hash password if provided', async () => {
      const updateData = {
        name: 'Updated Name',
        password: 'newPassword',
      };

      const hashedPassword = 'hashedNewPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
        password: hashedPassword,
      });

      const result = await service.update('1', updateData);

      expect(result.name).toBe('Updated Name');
      expect(result.password).toBe(hashedPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Name',
          password: hashedPassword,
        },
      });
    });

    it('should update user without hashing if password not provided', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
      });

      await service.update('1', updateData);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        mockUser,
        { ...mockUser, id: '2', email: 'test2@example.com' },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });
});
