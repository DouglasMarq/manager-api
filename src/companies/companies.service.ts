import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyRequestDto } from './dto/update-company-request.dto';
import { CompanyRepository } from '../repository/company.repository';
import { VehiclesService } from '../vehicles/vehicles.service';
import { ConfigService } from '../config/config.service';
import { postRequest, deleteRequest } from '../common/helpers';
import { TelemetryCreateCompanyRequestDto } from './dto/telemetry-create-company-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  private readonly telemetryApi: string;
  private readonly telemetryApiKey: string;
  private readonly telemetryApiCompaniesRoute = 'companies';

  constructor(
    private readonly companyRepository: CompanyRepository,
    @Inject(forwardRef(() => VehiclesService))
    private readonly vehicleService: VehiclesService,
    private readonly configService: ConfigService,
  ) {
    this.telemetryApi =
      this.configService.getTelemetryApiConfig().TELEMETRY_API_URL!;
    this.telemetryApiKey =
      this.configService.getTelemetryApiConfig().TELEMETRY_API_KEY!;
  }

  async companyExistsByCompanyRef(companyRef: number): Promise<boolean> {
    return await this.companyRepository.companyExistsByCompanyRef(companyRef);
  }

  async createCompany(
    createCompanyDto: CreateCompanyRequestDto,
  ): Promise<Company> {
    const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);

    const payload: TelemetryCreateCompanyRequestDto = {
      companyRef: createCompanyDto.companyRef,
      username: createCompanyDto.login,
      password: hashedPassword,
      callbackUrl: createCompanyDto.callbackUrl,
    };

    try {
      await postRequest(
        `${this.telemetryApi}/${this.telemetryApiCompaniesRoute}`,
        { 'X-Api-Key': this.telemetryApiKey },
        payload,
      );
    } catch (exception) {
      if (exception.response.status === 409) {
        throw new ConflictException('TELEMETRY.ALREADY_EXISTS');
      }
      if (exception.response.status === 400) {
        throw new BadRequestException('TELEMETRY.BAD_REQUEST');
      }
      if (exception.response.status === 401) {
        throw new UnauthorizedException('TELEMETRY.API_UNAUTHORIZED');
      }
      throw new InternalServerErrorException('TELEMETRY.API_ERROR');
    }

    return this.companyRepository.createCompany({
      ...createCompanyDto,
      password: hashedPassword,
    });
  }

  async findAllCompanies(): Promise<Company[]> {
    return this.companyRepository.findAllCompanies();
  }

  async findOneCompanyByCompanyRef(companyRef: number): Promise<Company> {
    const company = await this.companyRepository.findOneCompanyByCompanyRef(companyRef);

    if (!company) {
      this.logger.error(`Company with companyRef ${companyRef} not found`);
      throw new NotFoundException('COMPANY.NOT_FOUND');
    }

    return company;
  }

  async findOneCompanyByLogin(login: string): Promise<Company> {
    const company = await this.companyRepository.findOneCompanyByLogin(login);

    if (!company) {
      this.logger.error(`Company with login ${login} not found`);
      throw new NotFoundException('COMPANY.NOT_FOUND');
    }

    return company;
  }

  async updateCompanyByCompanyRef(
    companyRef: number,
    updateCompanyDto: UpdateCompanyRequestDto,
  ): Promise<Company> {
    const company = await this.companyRepository.findOneCompanyByCompanyRef(companyRef);

    if (!company) {
      this.logger.error(`Company with companyRef ${companyRef} not found`);
      throw new NotFoundException('COMPANY.NOT_FOUND');
    }

    return this.companyRepository.updateCompany(company, updateCompanyDto);
  }

  async removeCompanyByCompanyRef(companyRef: number): Promise<void> {
    if (!(await this.companyRepository.companyExistsById(companyRef))) {
      this.logger.error(`Company with companyRef ${companyRef} not found`);
      throw new NotFoundException('COMPANY.NOT_FOUND');
    }

    try {
      await deleteRequest(
        `${this.telemetryApi}/${this.telemetryApiCompaniesRoute}/${companyRef}`,
        { 'X-Api-Key': this.telemetryApiKey },
      );
    } catch (exception) {
      throw new InternalServerErrorException('TELEMETRY.API_ERROR');
    }

    await this.vehicleService.removeAllVehiclesByCompanyRef(companyRef);

    await this.companyRepository.removeCompanyByCompanyRef(companyRef);
  }
}
