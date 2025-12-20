import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyService: CompaniesService,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findByLogin(login);
  }

  async createUser(createUserDto: CreateUserRequestDto): Promise<User> {
    if (await this.userRepository.userExistsByLogin(createUserDto.login)) {
      this.logger.error(
        `User with login ${createUserDto.login} already exists`,
      );
      throw new ConflictException(
        'USER.EXISTS_BY_LOGIN',
        'User with this login already exists. Please use another login.',
      );
    }

    if (
      !(await this.companyService.companyExistsByCompanyRef(
        createUserDto.companyRef,
      ))
    ) {
      this.logger.error(
        `Company with companyRef ${createUserDto.companyRef} doesn't exists`,
      );
      throw new NotFoundException(
        'COMPANY.NOT_FOUND',
        "Company with this companyRef doesn't exist.",
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  async findAllUsersByCompanyRef(companyRef: number): Promise<User[]> {
    if (!(await this.companyService.companyExistsByCompanyRef(companyRef))) {
      this.logger.error(`Company with companyRef ${companyRef} doesn't exists`);
      throw new NotFoundException(
        'COMPANY.NOT_FOUND',
        "Company with this companyRef doesn't exist.",
      );
    }

    return this.userRepository.findAllUsersByCompanyRef(companyRef);
  }

  async findUserByCompanyRefAndUserId(
    companyRef: number,
    id: number,
  ): Promise<User> {
    if (!(await this.companyService.companyExistsByCompanyRef(companyRef))) {
      this.logger.error(`Company with companyRef ${companyRef} doesn't exists`);
      throw new NotFoundException(
        'COMPANY.NOT_FOUND',
        "Company with this companyRef doesn't exist.",
      );
    }

    const user = await this.userRepository.findUserByCompanyRefAndUserId(
      companyRef,
      id,
    );

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException('USER.NOT_FOUND');
    }

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneUserById(id);

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException('USER.NOT_FOUND');
    }

    return user;
  }

  async updateUserById(
    id: number,
    userRole: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<User> {
    if (
      !(await this.companyService.companyExistsByCompanyRef(
        updateUserDto.companyRef!,
      ))
    ) {
      this.logger.error(
        `Company with companyRef ${updateUserDto.companyRef} doesn't exists`,
      );
      throw new NotFoundException(
        'COMPANY.NOT_FOUND',
        "Company with this companyRef doesn't exist.",
      );
    }

    const user = await this.userRepository.findOneUserById(id);

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException('USER.NOT_FOUND');
    }

    updateUserDto.companyRef = user.companyRef.companyRef;
    if (userRole !== UserRole.ADMIN) {
      updateUserDto.role = user.role;
      updateUserDto.active = user.active;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.updateUser(user, updateUserDto);
  }

  async removeUserById(id: number): Promise<void> {
    const user = await this.userRepository.findOneUserById(id);
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException('USER.NOT_FOUND');
    }

    await this.userRepository.delete(user);
  }
}
