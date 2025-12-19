import { Module } from '@nestjs/common';
import { VehiclesModule } from './vehicles/vehicles.module';
import { CompaniesModule } from './companies/companies.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { TrackingModule } from './tracking/tracking.module';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
    }),
    VehiclesModule,
    CompaniesModule,
    UserModule,
    DatabaseModule,
    ConfigModule,
    AuthModule,
    TrackingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
