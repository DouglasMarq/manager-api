import { forwardRef, Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyRepository } from '../repository/company.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Company } from '../entities/company.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { ConfigModule } from '../config/config.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyRepository],
  imports: [
    MikroOrmModule.forFeature([Company]),
    forwardRef(() => VehiclesModule),
    ConfigModule,
  ],
  exports: [CompaniesService, CompanyRepository],
})
export class CompaniesModule {}
