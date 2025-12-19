import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateVehicleRequestDto {
  @ApiProperty({
    description: 'The ID of the companies the vehicles belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  companyRef!: number;

  @ApiProperty({
    description: 'The license plate of the vehicles',
    example: 'ABC-1234',
  })
  @IsOptional()
  @IsString()
  license?: string;

  @ApiProperty({
    description: 'The VIN (Vehicle Identification Number)',
    example: '1HGBH41JXMN109186',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  vin!: string;

  @ApiProperty({
    description: 'The latitude coordinate of the vehicles',
    example: 40.7128,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({
    description: 'The longitude coordinate of the vehicles',
    example: -74.006,
  })
  @IsOptional()
  @IsNumber()
  long?: number;

  @ApiProperty({
    description: 'The fuel level of the vehicles',
    example: 75,
  })
  @IsNotEmpty()
  @IsNumber()
  fuelLevel!: number;

  @ApiProperty({
    description: 'Indicates if the vehicles is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
