import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TelemetryCreateCompanyRequestDto {
  @IsString()
  @IsNotEmpty()
  callbackUrl!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsNumber()
  @IsNotEmpty()
  companyRef!: number;
}
