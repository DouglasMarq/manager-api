import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleRequestDto } from './dto/create-vehicle-request.dto';
import { UpdateVehicleRequestDto } from './dto/update-vehicle-request.dto';
import { Vehicle } from '../entities/vehicle.entity';
import { Roles, RolesGuard } from '../guards/roles.guard';
import { User } from '../guards/decorators/user.decorator';
import { UserRole } from '../entities/user.entity';

@ApiBearerAuth()
@Controller('vehicles')
@ApiTags('Vehicle')
@UseGuards(RolesGuard)
export class VehiclesController {
  private readonly logger = new Logger(VehiclesController.name);
  constructor(private readonly vehicleService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
    type: Vehicle,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vehicle already exists' })
  async createVehicle(
    @Body() createVehicleDto: CreateVehicleRequestDto,
  ): Promise<Vehicle> {
    this.logger.log(
      `Incoming request to create a new vehicle: ${JSON.stringify(createVehicleDto)}`,
    );
    return await this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Vehicles retrieved successfully',
    type: [Vehicle],
  })
  async findAllVehicles(): Promise<Vehicle[]> {
    this.logger.log(`Incoming request to get all vehicles`);

    return await this.vehicleService.findAllVehicles();
  }

  @Get(':companyRef')
  @ApiResponse({
    status: 200,
    description: 'Vehicles retrieved successfully',
    type: [Vehicle],
  })
  @ApiResponse({
    status: 403,
    description: 'User does not belong to the current company',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findAllVehiclesByCompanyRef(
    @Param('companyRef') companyRef: number,
    @User('companyRef') userCompanyRef: number,
    @User('role') role: string,
    @User('name') name: string,
  ): Promise<Vehicle[]> {
    this.logger.log(
      `Incoming request to get all vehicles for company: ${companyRef} by user ${name}`,
    );

    if (userCompanyRef !== companyRef && role !== UserRole.ADMIN) {
      this.logger.error(
        `User ${name} of company id ${userCompanyRef} does not belong to the company: ${companyRef}`,
      );
      throw new ForbiddenException('USER.DOESNOT_BELONG_TO_COMPANY');
    }

    return await this.vehicleService.findAllVehiclesByCompanyRef(companyRef);
  }

  @Get(':companyRef/:vin')
  @ApiResponse({
    status: 200,
    description: 'Vehicle retrieved successfully',
    type: Vehicle,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not belong to the current company',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findAllVehiclesByCompanyRefAndVin(
    @Param('companyRef') companyRef: number,
    @Param('vin') vin: string,
    @User('companyRef') userCompanyRef: number,
    @User('role') role: string,
    @User('name') name: string,
  ): Promise<Vehicle> {
    this.logger.log(
      `Incoming request to get vehicle: ${vin} for company: ${companyRef} by user: ${name}`,
    );

    if (userCompanyRef !== companyRef && role !== UserRole.ADMIN) {
      this.logger.error(
        `User ${name} of company id ${companyRef} does not belong to the company: ${companyRef}`,
      );
      throw new ForbiddenException('USER.DOESNOT_BELONG_TO_COMPANY');
    }

    return await this.vehicleService.findVehicleByVinAndCompanyRef(
      vin,
      companyRef,
    );
  }

  @Put(':vin')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async updateVehicleByVin(
    @Param('vin') vin: string,
    @Body() updateVehicleDto: UpdateVehicleRequestDto,
  ): Promise<Vehicle> {
    this.logger.log(
      `Incoming request to update vehicle: ${vin} with data: ${JSON.stringify(updateVehicleDto)}`,
    );

    return await this.vehicleService.updateVehicle(vin, updateVehicleDto);
  }

  @Delete(':companyRef/:vin')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async removeVehicleByVin(
    @Param('companyRef') companyRef: number,
    @Param('vin') vin: string,
  ): Promise<void> {
    this.logger.log(`Incoming request to delete vehicle with vin: ${vin}`);

    return await this.vehicleService.removeVehicle(companyRef, vin);
  }
}
