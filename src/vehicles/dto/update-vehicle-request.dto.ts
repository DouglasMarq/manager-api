import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleRequestDto } from './create-vehicle-request.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateVehicleRequestDto extends PartialType(
  CreateVehicleRequestDto,
) {
  @ApiPropertyOptional({
    description: 'The ID of the companies the vehicles belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  companyRef?: number;

  @ApiPropertyOptional({
    description: 'The license plate of the vehicles',
    example: 'ABC-1234',
  })
  @IsOptional()
  @IsString()
  license?: string;

  @ApiPropertyOptional({
    description: 'The VIN (Vehicle Identification Number)',
    example: '1HGBH41JXMN109186',
  })
  @IsNotEmpty()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({
    description: 'The latitude coordinate of the vehicles',
    example: 40.7128,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({
    description: 'The longitude coordinate of the vehicles',
    example: -74.006,
  })
  @IsOptional()
  @IsNumber()
  long?: number;

  @ApiPropertyOptional({
    description: 'The fuel level of the vehicles',
    example: 75.5,
  })
  @IsOptional()
  @IsNumber()
  fuelLevel?: number;

  @ApiPropertyOptional({
    description: 'Indicates if the vehicles is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
