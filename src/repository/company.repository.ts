import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Company } from '../entities/company.entity';
import { CreateCompanyRequestDto } from '../companies/dto/create-company-request.dto';
import { UpdateCompanyRequestDto } from '../companies/dto/update-company-request.dto';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly repo: EntityRepository<Company>,
    private readonly em: EntityManager,
  ) {}

  async companyExistsByCompanyRef(companyRef: number): Promise<boolean> {
    return (await this.repo.count({ companyRef })) > 0;
  }

  async companyExistsById(id: number): Promise<boolean> {
    return (await this.repo.count({ id })) > 0;
  }

  async createCompany(data: CreateCompanyRequestDto): Promise<Company> {
    const company = this.repo.create({
      ...data,
      active: data.active ?? true,
    });
    this.em.persist(company);
    await this.em.flush();
    return company;
  }

  async findAllCompanies(): Promise<Company[]> {
    return await this.repo.findAll({
      where: { active: true },
    });
  }

  async findOneCompanyByCompanyRef(
    companyRef: number,
  ): Promise<Company | null> {
    return await this.repo.findOne({ companyRef, active: true });
  }

  async findOneCompanyByLogin(login: string): Promise<Company | null> {
    return await this.repo.findOne({ login, active: true });
  }

  async updateCompany(
    company: Company,
    data: UpdateCompanyRequestDto,
  ): Promise<Company> {
    this.repo.assign(company, data);
    await this.em.flush();
    return company;
  }

  async removeCompanyByCompanyRef(id: number): Promise<void> {
    await this.repo.nativeUpdate({ id }, { active: false });
  }
}
