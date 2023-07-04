import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from "@nestjs/typeorm";
import { join } from "path";
import { readFileSync } from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: ".env",
});

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing)
      throw new Error(`config error - missing env.${key}`);

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort(): number {
    return parseInt(this.getValue("PORT", true));
  }

  public getJWTSecret(): string {
    return this.getValue("JWT_SECRET", true);
  }

  public getSaltRounds(): number {
    return parseInt(this.getValue("SALT_ROUNDS", true));
  }

  public isProduction() {
    const mode = this.getValue("MODE", false);
    return mode != "DEV";
  }

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
        ssl:
          this.getValue("POSTGRES_SSL") === "true"
            ? {
                ca: readFileSync(
                  join(
                    __dirname,
                    "..",
                    "..",
                    "data",
                    "db",
                    "ca-certificate.crt",
                  ),
                ).toString(),
              }
            : false,
        synchronize: false,
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
    ssl:
      this.getValue("POSTGRES_SSL") === "true"
        ? {
            ca: readFileSync(
              join(__dirname, "..", "..", "data", "db", "ca-certificate.crt"),
            ).toString(),
          }
        : false,
    synchronize: false,
    logging: true,
  };
}

const configService = new ConfigService(process.env).ensureValues([
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
]);

export { configService };
