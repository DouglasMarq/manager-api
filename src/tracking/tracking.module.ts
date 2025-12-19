import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  controllers: [TrackingController],
  imports: [VehiclesModule, CompaniesModule],
  providers: [TrackingService],
})
export class TrackingModule {}
