import { Module } from '@nestjs/common';
import { MandatesService } from './mandates.service';
import { MandatesController } from './mandates.controller';

@Module({
  providers: [MandatesService],
  controllers: [MandatesController]
})
export class MandatesModule {}
