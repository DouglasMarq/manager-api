import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackingUpdateVehicleRequestDto {
  @ApiProperty({
    description: 'Vehicle Identification Number',
    example: '1HGBH41JXMN109186',
  })
  @IsString()
  @IsNotEmpty()
  vin!: string;

  @ApiProperty({ description: 'Latitude coordinate', example: -23.5505 })
  @IsNumber()
  @IsNotEmpty()
  latitude!: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -46.6333 })
  @IsNumber()
  @IsNotEmpty()
  longitude!: number;
}
