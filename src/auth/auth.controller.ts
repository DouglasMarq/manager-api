import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {ApiTags, ApiResponse, ApiOperation} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { Public } from '../guards/decorators/public.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login to the application',
    description: 'Login to the application with username and password'
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
