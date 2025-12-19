import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequestDto } from './create-user-request.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {
  @ApiPropertyOptional({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The ID of the companies the user belongs to',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  companyRef?: number;

  @ApiPropertyOptional({
    description: 'The login identifier for the user',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(255)
  login?: string;

  @ApiPropertyOptional({
    description: 'The password for the user account',
    example: 'securePassword123',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 3 characters long' })
  @MaxLength(255)
  password?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the user account is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Indicates the user role',
    example: 'user',
    default: 'user',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
