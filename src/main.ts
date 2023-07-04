import helmet from "helmet";
import { Settings } from "luxon";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";

import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { configService } from "./config/env.config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  Settings.defaultZone = "Asia/Kolkata";

  app.use(helmet());
  app.use(compression());
  app.enableCors({ origin: "*" });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.getPort());
}

bootstrap();
