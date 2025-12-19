import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'The ID of the companies the user belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  companyRef!: number;

  @ApiProperty({
    description: 'The login identifier for the user',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(255)
  login!: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 3 characters long' })
  @MaxLength(255)
  password!: string;

  @ApiProperty({
    description: 'Indicates if the user account is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
