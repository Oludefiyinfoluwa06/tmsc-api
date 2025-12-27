import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User, Role } from '@prisma/client';

jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    name: 'Test User',
    role: Role.SUPER_ADMIN,
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result?.email).toBe('test@example.com');
      expect(mockUsersService.findOne).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });

    it('should return null when password is incorrect', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUser.password,
      );
    });
  });

  describe('login', () => {
    it('should return access token and user info', () => {
      const authUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.SUPER_ADMIN,
      };

      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = service.login(authUser);

      expect(result).toHaveProperty('access_token', 'mock.jwt.token');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual(authUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: authUser.email,
        sub: authUser.id,
        role: authUser.role,
      });
    });

    it('should generate token with correct payload structure', () => {
      const authUser = {
        id: '2',
        email: 'admin@example.com',
        name: 'Admin User',
        role: Role.GALLERY_ADMIN,
      };

      service.login(authUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'admin@example.com',
        sub: '2',
        role: Role.GALLERY_ADMIN,
      });
    });
  });

  describe('getMe', () => {
    it('should return user without password when user exists', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.getMe('1');

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('1');
      expect(result.email).toBe('test@example.com');
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.getMe('999')).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findById).toHaveBeenCalledWith('999');
    });
  });
});
