import { config } from '@dotenvx/dotenvx';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { I18nService, I18nValidationPipe } from 'nestjs-i18n';
import { ExceptionsFilter } from './exceptions/exceptions.filter';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const i18nService = app.get<I18nService>(I18nService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  app.useGlobalPipes(
    new I18nValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ExceptionsFilter(i18nService));

  const config = new DocumentBuilder()
    .setTitle('Manager API')
    .setDescription('Manage Companies, Vehicles and Users')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  SwaggerModule.setup('api', app, document, options);

  await app
    .listen(process.env.PORT!)
    .then(() => Logger.log(`Server running on port ${process.env.PORT}`));
}

bootstrap();
