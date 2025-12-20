import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyRequestDto {
  @ApiProperty({ description: 'Company name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Company address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Company phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Company active status', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'Company Login' })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(255, { message: 'Login must be at maximum 55 characters long' })
  login?: string;

  @ApiProperty({
    description:
      'Company Password, between 8 and 255 characters. Password becomes hashed.',
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, {
    message: 'Password must be at a maximum 255 characters long',
  })
  password?: string;

  @ApiProperty({ description: 'Application Callback URL' })
  @IsString()
  @IsUrl({ require_tld: false }, { message: 'callbackUrl must be a valid URL' })
  @IsOptional()
  callbackUrl?: string;
}
