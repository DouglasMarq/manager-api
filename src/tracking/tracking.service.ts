import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';
import { extractCredentials } from '../common/helpers';
import { CompaniesService } from '../companies/companies.service';
import { TrackingUpdateVehicleRequestDto } from './dto/tracking-update-vehicle-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(
    private readonly vehicleService: VehiclesService,
    private readonly companyService: CompaniesService,
  ) {}

  async validateCredentials(auth: string): Promise<void> {
    const credentials = extractCredentials(auth);
    this.logger.log(
      `Validating credentials for login: ${credentials.username}`,
    );

    const company = await this.companyService.findOneCompanyByLogin(
      credentials.username,
    );

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      company.password,
    );

    if (credentials.username !== company.login || !isPasswordValid) {
      throw new UnauthorizedException('COMPANY.INVALID_CREDENTIALS');
    }

    this.logger.log(`Authenticated company: ${credentials.username}`);
  }

  async updateVehicleTracking(
    data: TrackingUpdateVehicleRequestDto,
  ): Promise<void> {
    this.logger.log(
      `Updating vehicle ${data.vin} with data: ${JSON.stringify(data)}`,
    );

    const updateData = {
      lat: data.latitude,
      long: data.longitude,
    };

    await this.vehicleService.updateVehicle(data.vin, updateData);
  }
}
