import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyRequestDto } from './dto/update-company-request.dto';
import { Company } from '../entities/company.entity';
import { Roles, RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { User } from '../guards/decorators/user.decorator';

@ApiBearerAuth()
@Controller('companies')
@ApiTags('Companies')
@UseGuards(RolesGuard)
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);

  constructor(private readonly companyService: CompaniesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: Company,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCompany(
    @Body() createCompanyDto: CreateCompanyRequestDto,
  ): Promise<Company> {
    this.logger.log(
      `Incoming request to create a new company: ${JSON.stringify(createCompanyDto)}`,
    );

    return await this.companyService.createCompany(createCompanyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Companies retrieved successfully',
    type: [Company],
  })
  async findAllCompanies(): Promise<Company[]> {
    this.logger.log(`Incoming request to get all companies`);

    return await this.companyService.findAllCompanies();
  }

  @Get(':companyRef')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
    type: Company,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not belong to the current company',
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findCompanyByCompanyRef(
    @Param('companyRef') companyRef: number,
    @User('companyRef') userCompanyRef: number,
    @User('role') role: string,
    @User('name') name: string,
  ): Promise<Company | null> {
    this.logger.log(`Incoming request to get company with ref: ${companyRef}`);

    if (userCompanyRef !== companyRef && role !== UserRole.ADMIN) {
      this.logger.error(
        `User ${name} of company id ${companyRef} does not belong to the company: ${companyRef}`,
      );
      throw new ForbiddenException('USER.DOESNOT_BELONG_TO_COMPANY');
    }

    return await this.companyService.findOneCompanyByCompanyRef(companyRef);
  }

  @Put(':companyRef')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async updateCompanyByCompanyRef(
    @Param('companyRef') companyRef: number,
    @Body() updateCompanyDto: UpdateCompanyRequestDto,
  ): Promise<Company> {
    this.logger.log(
      `Incoming request to update company with companyRef: ${companyRef} with data: ${JSON.stringify(updateCompanyDto)}`,
    );

    return await this.companyService.updateCompanyByCompanyRef(
      companyRef,
      updateCompanyDto,
    );
  }

  @Delete(':companyRef')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async removeCompanyByCompanyRef(
    @Param('companyRef') companyRef: number,
  ): Promise<void> {
    this.logger.log(
      `Incoming request to delete company with companyRef: ${companyRef}`,
    );

    return await this.companyService.removeCompanyByCompanyRef(companyRef);
  }
}
