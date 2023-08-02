import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { configService } from "./config/env.config.service";
import { RedisIoAdapter } from "./utils/redis.adapter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.enableCors({
    origin: "*",
  });

  app.use(compression());
  app.useWebSocketAdapter(redisIoAdapter);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.getPort());
}

bootstrap();
