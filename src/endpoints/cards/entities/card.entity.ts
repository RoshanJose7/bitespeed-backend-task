import { ObjectType, Field } from "@nestjs/graphql";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { CARDTYPE } from "../constants/enums.constants";
import { CardTemplate } from "../../card_templates/entities/card_template.entity";

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

  // TODO: Avatar

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

  @Column({
    type: "varchar",
  })
  @Field({ description: "User Id of the Card Owner" })
  userId: string;

  @Column({
    type: "varchar",
  })
  @Field({ description: "Card Template Id of the Card Owner" })
  cardTemplateId: string;

  @ManyToOne(() => User, (user) => user.cards)
  @Field(() => User, { description: "Card Owner" })
  user: User;

  @ManyToOne(() => CardTemplate, (cardTemplate) => cardTemplate.cards)
  @Field(() => CardTemplate, { description: "Card Template of the Card" })
  cardTemplate: CardTemplate;

  // TODO: FK: Card Engagement Panels
  // TODO: FK: Card Authorized Users
}
