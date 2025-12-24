import { UsersService } from './users.service';
import { Role, Prisma } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: Prisma.UserCreateInput): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, role: Role): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
