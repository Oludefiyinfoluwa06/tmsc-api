import { Role } from '@prisma/client';
export interface UserPayload {
    userId: string;
    email: string;
    role: Role;
}
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: Role;
}
