import { ObjectType, Field } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "../../cards/entities/card.entity";
import { CardTemplateLink } from "./card_template_link.entity";

@Entity()
@ObjectType()
export class CardTemplate {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({
    type: "text",
    nullable: false,
  })
  @Field({ description: "CSS Styles For Card Template" })
  style: string;

  @Column({
    type: "varchar",
  })
  @Field({ description: "Color for Card Template" })
  color: string;

  @Column({
    type: "varchar",
    array: true,
  })
  @Field(() => [String], { description: "Valid link Ids for Card Template" })
  linkIds: string[];

  @OneToMany(
    () => CardTemplateLink,
    (cardTemplateLink) => cardTemplateLink.cardTemplate,
    {
      nullable: true,
    },
  )
  @Field(() => [CardTemplateLink], {
    description: "Valid links for Card Template",
  })
  links: CardTemplateLink[];

  @OneToMany(() => Card, (card) => card.cardTemplate, {
    nullable: true,
  })
  @Field(() => [Card], {
    nullable: true,
    description: "Card Template of the Card",
  })
  cards?: Card[];
}
