import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    getProfile(req: RequestWithUser): Promise<{
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(): {
        message: string;
    };
}
export {};
