import { ObjectType, Field } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "../../cards/entities/card.entity";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  @Field({ description: "Full Name of the User" })
  name: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: true,
  })
  @Field({ nullable: true, description: "Email of the User" })
  email?: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  @Field({ description: "Phone Number of the User" })
  phoneNumber: string;

  @OneToMany(() => Card, (card) => card.user, {
    nullable: true,
  })
  @Field(() => [Card], { nullable: true })
  cards?: Card[];
}
