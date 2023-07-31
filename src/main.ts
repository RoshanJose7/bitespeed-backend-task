import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { configService } from "./config/env.config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: "*",
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.getPort());
}

bootstrap();
