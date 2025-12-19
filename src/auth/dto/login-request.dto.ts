import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'User Name' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
