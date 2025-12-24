import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { MandatesModule } from './mandates/mandates.module';
import { RequestsModule } from './requests/requests.module';
import { BookingsModule } from './bookings/bookings.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GalleryGroupsModule } from './gallery-groups/gallery-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    GalleryModule,
    MandatesModule,
    RequestsModule,
    BookingsModule,
    ContactModule,
    UploadModule,
    AnalyticsModule,
    GalleryGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
