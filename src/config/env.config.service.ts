import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { join } from "path";
import { readFileSync } from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: ".env.dev",
});

class ConfigService {
  public typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
      return {
        type: "postgres",
        host: this.getValue("POSTGRES_HOST"),
        port: parseInt(this.getValue("POSTGRES_PORT")),
        username: this.getValue("POSTGRES_USER"),
        password: this.getValue("POSTGRES_PASSWORD"),
        database: this.getValue("POSTGRES_DB"),
        entities: [__dirname + "/../**/*.entity.{js,ts}"],
        migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
        extra: {
          charset: "utf8mb4_unicode_ci",
        },
        ssl: true,
        synchronize: true,
      };
    },
  };
  public typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: this.getValue("POSTGRES_HOST"),
    port: parseInt(this.getValue("POSTGRES_PORT")),
    username: this.getValue("POSTGRES_USER"),
    password: this.getValue("POSTGRES_PASSWORD"),
    database: this.getValue("POSTGRES_DB"),
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
    extra: {
      charset: "utf8mb4_unicode_ci",
    },
    ssl: true,
    synchronize: true,
    logging: true,
  };

  constructor(private env: { [k: string]: string | undefined }) {}

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort(): number {
    return parseInt(this.getValue("PORT", true));
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing)
      throw new Error(`config error - missing env.${key}`);

    return value;
  }
}

const configService = new ConfigService(process.env).ensureValues([
  "POSTGRES_HOST",
  "POSTGRES_DB",
  "POSTGRES_PORT",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
]);

export { configService };
