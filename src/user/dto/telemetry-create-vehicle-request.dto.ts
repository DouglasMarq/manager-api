import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TelemetryCreateVehicleRequestDto {
  @IsString()
  @IsNotEmpty()
  vin!: string;

  @IsNumber()
  @IsNotEmpty()
  fuelLevel!: number;
}
