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
  @MaxLength(255)
  login?: string;

  @ApiProperty({ description: 'Company Password' })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(255)
  password?: string;

  @ApiProperty({ description: 'Application Callback URL' })
  @IsString()
  @IsUrl({ require_tld: false }, { message: 'callbackUrl must be a valid URL' })
  @IsOptional()
  callbackUrl?: string;
}
