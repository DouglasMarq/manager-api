import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { Public } from '../guards/decorators/public.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login to the application',
    description: 'Login to the application with username and password',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginRequestDto) {
    this.logger.log(`Received login request for user: ${loginDto.username}`);

    return this.authService.login(loginDto.username, loginDto.password);
  }
}
