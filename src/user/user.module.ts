import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [MikroOrmModule.forFeature([User]), CompaniesModule],
  exports: [UserService],
})
export class UserModule {}
