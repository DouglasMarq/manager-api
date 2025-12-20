import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyRequestDto {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Company address' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ description: 'Company phone number' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ description: 'Company active status', default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'Company Reference' })
  @IsNumber()
  @IsNotEmpty()
  companyRef!: number;

  @ApiProperty({ description: 'Company Login' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(255, { message: 'Login must be at maximum 55 characters long' })
  login!: string;

  @ApiProperty({
    description: 'Company Password, between 8 and 255 characters.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, {
    message: 'Password must be at a maximum 255 characters long',
  })
  password!: string;

  @ApiProperty({ description: 'Application Callback URL' })
  @IsString()
  @IsUrl({ require_tld: false }, { message: 'callbackUrl must be a valid URL' })
  @IsNotEmpty()
  callbackUrl: string;
}
