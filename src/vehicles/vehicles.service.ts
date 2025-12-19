import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { VehicleRepository } from '../repository/vehicle.repository';
import { CreateVehicleRequestDto } from './dto/create-vehicle-request.dto';
import { UpdateVehicleRequestDto } from './dto/update-vehicle-request.dto';
import { Vehicle } from '../entities/vehicle.entity';
import { ConfigService } from '../config/config.service';
import { deleteRequest, postRequest } from '../common/helpers';
import { TelemetryCreateVehicleRequestDto } from '../user/dto/telemetry-create-vehicle-request.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  private readonly telemetryApi: string;
  private readonly telemetryApiKey: string;
  private readonly telemetryApiVehiclesRoute = 'vehicles';

  constructor(
    private readonly vehicleRepository: VehicleRepository,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companyService: CompaniesService,
    private readonly configService: ConfigService,
  ) {
    this.telemetryApi =
      this.configService.getTelemetryApiConfig().TELEMETRY_API_URL!;
    this.telemetryApiKey =
      this.configService.getTelemetryApiConfig().TELEMETRY_API_KEY!;
  }

  async createVehicle(
    createVehicleDto: CreateVehicleRequestDto,
  ): Promise<Vehicle> {
    if (
      !(await this.companyService.companyExistsByCompanyRef(
        createVehicleDto.companyRef,
      ))
    ) {
      this.logger.error(
        `Company with companyRef ${createVehicleDto.companyRef} not found`,
      );
      throw new NotFoundException('COMPANY.NOT_FOUND');
    }

    const payload: TelemetryCreateVehicleRequestDto = {
      vin: createVehicleDto.vin,
      fuelLevel: createVehicleDto.fuelLevel,
    };

    try {
      await postRequest(
        `${this.telemetryApi}/${this.telemetryApiVehiclesRoute}?companyRef=${createVehicleDto.companyRef}`,
        { 'X-Api-Key': this.telemetryApiKey },
        payload,
      );
    } catch (exception) {
      throw new InternalServerErrorException('TELEMETRY.API_ERROR');
    }

    return this.vehicleRepository.createVehicle(createVehicleDto);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAllVehicles();
  }

  async findVehicleByVinAndCompanyId(
    vin: string,
    companyRef: number,
  ): Promise<Vehicle> {
    const vehicle =
      await this.vehicleRepository.findOneVehicleByVinAndCompanyId(
        vin,
        companyRef,
      );

    if (!vehicle) {
      this.logger.error(
        `Vehicle with vin ${vin} and companyId ${companyRef} not found`,
      );
      throw new NotFoundException('VEHICLE.NOT_FOUND');
    }

    return vehicle;
  }

  async updateVehicle(
    vin: string,
    updateVehicleDto: UpdateVehicleRequestDto,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOneVehicleByVin(vin);

    if (!vehicle) {
      this.logger.error(`Vehicle with vin ${vin} not found`);
      throw new NotFoundException('VEHICLE.NOT_FOUND');
    }

    return this.vehicleRepository.updateVehicle(vehicle, updateVehicleDto);
  }

  async removeVehicle(companyRef: number, vin: string): Promise<void> {
    if (!(await this.vehicleRepository.vehicleExistsByVin(vin))) {
      this.logger.error(`Vehicle with vin ${vin} not found`);
      throw new NotFoundException('VEHICLE.NOT_FOUND');
    }

    try {
      await deleteRequest(
        `${this.telemetryApi}/${this.telemetryApiVehiclesRoute}/${vin}?companyRef=${companyRef}`,
        { 'X-Api-Key': this.telemetryApiKey },
      );
    } catch (e) {
      if (e.response.status === 404) {
        throw new NotFoundException('VEHICLE.NOT_FOUND');
      }

      throw new InternalServerErrorException('TELEMETRY.API_ERROR');
    }

    await this.vehicleRepository.removeVehicleByVin(vin);
  }

  async removeAllVehiclesByCompanyId(companyRef: number): Promise<void> {
    await this.vehicleRepository.removeVehiclesByCompanyId(companyRef);
  }
}
