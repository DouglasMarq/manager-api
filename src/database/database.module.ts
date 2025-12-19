import { Module } from '@nestjs/common';
import { Database } from './database';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [Database],
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbCfg = configService.getDatabaseConfig();
        return {
          entities: ['dist/**/*.entity.js'],
          entitiesTs: ['src/**/*.entity.ts'],
          driver: PostgreSqlDriver,
          dbName: dbCfg.DB_NAME,
          password: dbCfg.DB_PASSWORD,
          user: dbCfg.DB_USER,
          clientUrl: dbCfg.DB_URL,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
