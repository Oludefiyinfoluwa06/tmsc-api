import { Module, OnModuleInit } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seedSuperAdmin();
  }
}
