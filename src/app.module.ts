import { join } from "path";
import { Module } from "@nestjs/common";
import { ApolloDriver } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { configService } from "./config/env.config.service";
import { UsersModule } from "./endpoints/users/users.module";
import { CardsModule } from "./endpoints/cards/cards.module";
import { CardTemplatesModule } from "./endpoints/card_templates/card_templates.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    TypeOrmModule.forRootAsync(configService.typeOrmAsyncConfig),
    UsersModule,
    CardsModule,
    CardTemplatesModule,
  ],
})
export class AppModule {}
