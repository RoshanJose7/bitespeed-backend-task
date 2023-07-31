import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { configService } from "./config/env.config.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true
	});

	app.enableCors({
		origin: "*"
	});

	app.use(compression());
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(configService.getPort());
}

bootstrap();
