import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async seedSuperAdmin(): Promise<void> {
    try {
      const superAdminEmail =
        process.env.SUPER_ADMIN_EMAIL || 'admin@example.com';
      const superAdminPassword =
        process.env.SUPER_ADMIN_PASSWORD || 'SuperSecurePassword123!';
      const superAdminName =
        process.env.SUPER_ADMIN_NAME || 'Super Administrator';

      // Check if super admin already exists
      const existingSuperAdmin =
        await this.usersService.findOne(superAdminEmail);

      if (existingSuperAdmin) {
        this.logger.log(
          `Super admin already exists with email: ${superAdminEmail}`,
        );
        return;
      }

      // Create super admin user
      const superAdmin = await this.usersService.create({
        email: superAdminEmail,
        password: superAdminPassword,
        name: superAdminName,
        role: Role.SUPER_ADMIN,
        isActive: true,
      });

      this.logger.log(
        `Super admin created successfully with email: ${superAdmin.email}`,
      );
    } catch (error) {
      this.logger.error('Failed to seed super admin:', error);
      throw error;
    }
  }
}
