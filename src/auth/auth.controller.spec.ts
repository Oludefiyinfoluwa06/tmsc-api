import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    getMe: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: Role.SUPER_ADMIN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user on valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const loginResponse = {
        access_token: 'jwt-token',
        user: mockUser,
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockReturnValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(loginResponse);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockRequest = {
        user: { userId: '1', email: 'test@example.com', role: 'SUPER_ADMIN' },
      };

      const userProfile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.SUPER_ADMIN,
      };

      mockAuthService.getMe.mockResolvedValue(userProfile);

      const result = await controller.getProfile(
        mockRequest as unknown as Parameters<AuthController['getProfile']>[0],
      );

      expect(mockAuthService.getMe).toHaveBeenCalledWith('1');
      expect(result).toEqual(userProfile);
    });
  });

  describe('logout', () => {
    it('should return logout success message', () => {
      const result = controller.logout();

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
