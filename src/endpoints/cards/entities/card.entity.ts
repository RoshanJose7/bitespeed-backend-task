import { ObjectType, Field } from "@nestjs/graphql";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { CARDTYPE } from "../constants/enums.constants";

@Entity()
@ObjectType()
export class Card {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({
    type: "enum",
    enum: CARDTYPE,
  })
  @Field(() => CARDTYPE, { description: "Type of Card" })
  type: CARDTYPE;

  @Column({
    type: "varchar",
  })
  @Field({ description: "Profile of the Card Owner" })
  profile: string;

  // Avatar

  @Column({
    type: "varchar",
  })
  @Field({ description: "Name of Card" })
  name: string;

  @Column({
    type: "varchar",
  })
  @Field({ description: "Title of the Card" })
  title: string;

  @Column({
    type: "varchar",
  })
  @Field({ description: "Description of the Card" })
  description: string;

  @Column({
    type: "varchar",
    array: true,
  })
  @Field(() => [String], { description: "Links of the Card" })
  links: string[];

  // Card Owner Relation
  @Column({
    type: "varchar",
  })
  @Field({ description: "User id of the Card Owner" })
  userId: string;

  @ManyToOne(() => User, (user) => user.cards)
  @Field(() => User)
  user: User;

  // FK: Card Template
  // FK: Card Engagement Panels
  // FK: Card Authorized Users
}
