import { createClient } from "redis";
import { ServerOptions } from "socket.io";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { configService } from "../config/env.config.service";
import { Logger } from "@nestjs/common";

export class RedisIoAdapter extends IoAdapter {
  private logger: Logger = new Logger("RedisIoAdapter");
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: configService.getRedisHost(),
    });

    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log("Nest application connected to REDIS");
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
