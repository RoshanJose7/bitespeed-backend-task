import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from "@nestjs/typeorm";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: process.env.NODE_ENV
    ? process.env.NODE_ENV.trim() !== "DEV"
      ? ".env.prod"
      : ".env.dev"
    : ".env.dev",
});

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  // Configuration for the TypeORM module, defined as an async option
  public typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
      // Construct and return the TypeORM configuration options
      return {
        type: "postgres", // Database type (PostgreSQL)
        host: this.getValue("POSTGRES_HOST"), // Database host
        port: parseInt(this.getValue("POSTGRES_PORT")), // Database port
        username: this.getValue("POSTGRES_USER"), // Database username
        password: this.getValue("POSTGRES_PASSWORD"), // Database password
        database: this.getValue("POSTGRES_DB"), // Database name
        entities: [__dirname + "/../**/*.entity.{js,ts}"], // Entity files to be included
        migrations: [__dirname + "/../database/migrations/*.{js,ts}"], // Migration files to be included
        ssl: this.getValue("POSTGRES_SSL") === "true", // Enable SSL based on environment value
        synchronize: true, // Disable automatic schema synchronization
      };
    },
  };

  // Ensure that the specified environment keys have values
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  // Get the port number from the environment configuration
  public getPort(): number {
    return parseInt(this.getValue("PORT", true));
  }

  // Get the value of an environment variable
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    // Throw an error if the value is missing and throwOnMissing is true
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

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
