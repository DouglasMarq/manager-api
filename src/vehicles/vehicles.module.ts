import { forwardRef, Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Vehicle } from '../entities/vehicle.entity';
import { ConfigModule } from '../config/config.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleRepository],
  imports: [
    MikroOrmModule.forFeature([Vehicle]),
    ConfigModule,
    forwardRef(() => CompaniesModule),
  ],
  exports: [VehiclesService, VehicleRepository],
})
export class VehiclesModule {}
