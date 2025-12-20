import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { UpdateUserRequestDto } from '../user/dto/update-user-request.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async userExistsByLogin(login: string): Promise<boolean> {
    return (await this.repo.count({ login })) > 0;
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = await this.repo.findOne({ login, active: true });
    if (user && user.companyRef) {
      await this.em.populate(user, ['companyRef']);
    }
    return user;
  }

  async createUser(data: CreateUserRequestDto): Promise<User> {
    const { companyRef: companyRef, ...userData } = data;
    const company = this.em.getReference(Company, companyRef);

    const user = this.repo.create({
      ...userData,
      companyRef: company,
      active: userData.active ?? true,
      role: userData.role ?? UserRole.USER,
    });
    this.em.persist(user);
    await this.em.flush();
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.repo.findAll({
      where: { active: true },
    });
  }

  async findAllUsersByCompanyRef(companyRef: number): Promise<User[]> {
    return await this.repo.findAll({
      where: { active: true, companyRef: companyRef },
    });
  }

  async findOneUserById(id: number): Promise<User | null> {
    return await this.repo.findOne({ id, active: true });
  }

  async findUserByCompanyRefAndUserId(
    companyRef: number,
    id: number,
  ): Promise<User | null> {
    return await this.repo.findOne({
      id,
      companyRef: companyRef,
      active: true,
    });
  }

  async updateUser(user: User, data: UpdateUserRequestDto): Promise<User> {
    const { companyRef: companyRef, ...updateData } = data;
    const updatePayload: any = { ...updateData };

    if (companyRef !== undefined) {
      updatePayload.company = this.em.getReference(Company, companyRef);
    }

    this.repo.assign(user, updatePayload);
    await this.em.flush();
    return user;
  }

  async delete(user: User): Promise<void> {
    user.active = false;
    await this.em.flush();
  }
}
