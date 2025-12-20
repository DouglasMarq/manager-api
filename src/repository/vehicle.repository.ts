import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleRequestDto } from '../vehicles/dto/create-vehicle-request.dto';
import { UpdateVehicleRequestDto } from '../vehicles/dto/update-vehicle-request.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class VehicleRepository {
  private readonly logger = new Logger(VehicleRepository.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly repo: EntityRepository<Vehicle>,
    private readonly em: EntityManager,
  ) {}

  async vehicleExistsByVin(vin: string): Promise<boolean> {
    return (await this.repo.count({ vin })) > 0;
  }

  async createVehicle(data: CreateVehicleRequestDto): Promise<Vehicle> {
    if (await this.vehicleExistsByVin(data.vin)) {
      this.logger.error(`Vehicle with vin ${data.vin} already exists`);
      throw new ConflictException(
        'VEHICLE.EXISTS_BY_VIN',
        'Vehicle with this VIN already exists. Please use another VIN.',
      );
    }

    const { companyRef: companyRef, ...vehicleData } = data;
    const company = this.em.getReference(Company, companyRef);

    const vehicle = this.repo.create({
      ...vehicleData,
      companyRef: company,
    });
    this.em.persist(vehicle);
    await this.em.flush();
    return vehicle;
  }

  async findAllVehicles(): Promise<Vehicle[]> {
    return await this.repo.findAll({
      where: { active: true },
    });
  }

  async findAllVehiclesByCompanyRef(companyRef: number): Promise<Vehicle[]> {
    return await this.repo.findAll({
      where: { active: true, companyRef: companyRef },
    });
  }

  async findOneVehicleByVinAndCompanyRef(
    vin: string,
    companyRef: number,
  ): Promise<Vehicle | null> {
    return await this.repo.findOne({
      vin,
      companyRef: companyRef,
      active: true,
    });
  }

  async findOneVehicleByVin(vin: string): Promise<Vehicle | null> {
    return await this.repo.findOne({ vin, active: true });
  }

  async updateVehicle(
    vehicle: Vehicle,
    data: UpdateVehicleRequestDto,
  ): Promise<Vehicle> {
    const { companyRef: companyRef, ...updateData } = data;
    const updatePayload: any = { ...updateData };

    if (companyRef !== undefined) {
      updatePayload.company = this.em.getReference(Company, companyRef);
    }

    this.repo.assign(vehicle, updatePayload);
    await this.em.flush();
    return vehicle;
  }

  async removeVehicleByVin(vin: string): Promise<void> {
    await this.repo.nativeUpdate({ vin }, { active: false });
  }

  async removeVehiclesByCompanyRef(companyRef: number): Promise<void> {
    await this.repo.nativeUpdate({ companyRef: companyRef }, { active: false });
  }
}
