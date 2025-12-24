import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthUser } from './types';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null>;
    login(user: AuthUser): {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    };
    getMe(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
