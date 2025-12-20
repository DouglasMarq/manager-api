import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { User, UserRole } from '../entities/user.entity';
import { Roles, RolesGuard } from '../guards/roles.guard';
import { User as UsersJwt } from '../guards/decorators/user.decorator';

@ApiBearerAuth()
@Controller('user')
@ApiTags('User')
@UseGuards(RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() createUserDto: CreateUserRequestDto): Promise<User> {
    this.logger.log(
      `Incoming request to create a new user: ${JSON.stringify(createUserDto)}`,
    );

    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  async findAllUsers(): Promise<User[]> {
    this.logger.log(`Incoming request to get all users`);

    return await this.userService.findAllUsers();
  }

  @Get(':companyRef')
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not belong to the current company',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findAllUsersByCompanyRef(
    @Param('companyRef') companyRef: number,
    @UsersJwt('companyRef') userCompanyRef: number,
    @UsersJwt('role') role: string,
    @UsersJwt('name') name: string,
  ): Promise<User[]> {
    this.logger.log(
      `Incoming request to get all users for company: ${companyRef} by user ${name}`,
    );

    if (userCompanyRef !== companyRef && role !== UserRole.ADMIN) {
      this.logger.error(
        `User ${name} of company id ${userCompanyRef} does not belong to the company: ${companyRef}`,
      );
      throw new Error('USER.DOESNOT_BELONG_TO_COMPANY');
    }

    return await this.userService.findAllUsersByCompanyRef(companyRef);
  }

  @Get(':companyRef/:id')
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not belong to the current company',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserByCompanyRefAndUserId(
    @Param('companyRef') companyRef: number,
    @Param('id') id: number,
    @UsersJwt('companyRef') userCompanyRef: number,
    @UsersJwt('role') role: string,
    @UsersJwt('name') name: string,
  ): Promise<User> {
    this.logger.log(`Incoming request to get user: ${id} by user ${name}`);

    if (userCompanyRef !== companyRef && role !== UserRole.ADMIN) {
      this.logger.error(
        `User ${name} of company id ${userCompanyRef} does not belong to the company: ${companyRef}`,
      );
      throw new Error('USER.DOESNOT_BELONG_TO_COMPANY');
    }

    return await this.userService.findUserByCompanyRefAndUserId(companyRef, id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Possible reasons:\n- User does not belong to the current company\n- User cannot update another user',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserRequestDto,
    @UsersJwt('role') role: string,
    @UsersJwt('name') name: string,
    @UsersJwt('userId') userId: number,
  ): Promise<User> {
    this.logger.log(
      `Incoming request to update user with id: ${id} with data: ${JSON.stringify(updateUserDto)}`,
    );

    if (id !== userId && role !== UserRole.ADMIN) {
      this.logger.error(`User ${name} can not update user with id: ${id}`);
      throw new Error('USER.CANNOT_UPDATE_OTHER_USER');
    }

    return await this.userService.updateUserById(id, role, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async removeUser(@Param('id') id: number): Promise<void> {
    this.logger.log(`Incoming request to delete user with id: ${id}`);

    return await this.userService.removeUserById(id);
  }
}
