import { Injectable } from '@nestjs/common';
import {
  DatabaseConfig,
  TelemetryApiConfig,
} from './interfaces/config.interface';

@Injectable()
export class ConfigService {
  get(key: string): string | undefined {
    return process.env[key];
  }

  getDatabaseConfig(): DatabaseConfig {
    return {
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_URL: process.env.DB_URL,
      DB_NAME: process.env.DB_NAME,
    };
  }

  getTelemetryApiConfig(): TelemetryApiConfig {
    return {
      TELEMETRY_API_URL: process.env.TELEMETRY_API_URL,
      TELEMETRY_API_KEY: process.env.TELEMETRY_API_KEY,
      CALLBACK_URL: process.env.CALLBACK_URL,
    };
  }
}
