import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    super();
    const url = configService.get<string>('DATABASE_URL');

    if (!url) {
      this.logger.error('DATABASE_URL is not defined in environment variables');
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database');
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      throw error;
    }
  }
}
