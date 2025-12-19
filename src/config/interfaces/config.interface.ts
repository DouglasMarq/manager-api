export interface DatabaseConfig {
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_URL: string | undefined;
  DB_NAME: string | undefined;
}

export interface TelemetryApiConfig {
  TELEMETRY_API_URL: string | undefined;
  TELEMETRY_API_KEY: string | undefined;
  CALLBACK_URL: string | undefined;
}
