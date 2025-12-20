import {
  Body,
  Controller,
  Logger,
  Post,
  Headers as Header,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { TrackingUpdateVehicleRequestDto } from './dto/tracking-update-vehicle-request.dto';
import { Public } from '../guards/decorators/public.decorator';

@Controller('tracking')
@ApiTags('Tracking')
export class TrackingController {
  private readonly logger = new Logger(TrackingController.name);

  constructor(private readonly telemetryService: TrackingService) {}

  @Public()
  @Post('/webhook')
  @ApiOperation({
    summary: 'Update vehicle telemetry',
    description:
      'Update vehicle telemetry for a given VIN. A basic authentication is needed to send update requests to this route.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Basic Authentication',
    required: true,
  })
  @ApiResponse({ status: 204, description: 'Data successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'VIN not found' })
  async updateVehicleTelemetry(
    @Header('authorization') auth: string,
    @Body() updateTracking: TrackingUpdateVehicleRequestDto,
  ) {
    this.logger.log(
      `Received request to update vehicle telemetry for VIN: ${updateTracking.vin}`,
    );
    await this.telemetryService.validateCredentials(auth);

    await this.telemetryService.updateVehicleTracking(updateTracking);
  }
}
