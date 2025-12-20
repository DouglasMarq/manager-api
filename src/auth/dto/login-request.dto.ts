import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'User Name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(255, { message: 'Login must be at maximum 55 characters long' })
  username!: string;

  @ApiProperty({ description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  password!: string;
}
