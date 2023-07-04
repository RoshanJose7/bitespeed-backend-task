import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from "@nestjs/graphql";

import { Card } from "./entities/card.entity";
import { CardsService } from "./cards.service";
import { CreateCardInput } from "./dto/create-card.input";
import { UpdateCardInput } from "./dto/update-card.input";
import { User } from "../users/entities/user.entity";

@Resolver(() => Card)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Mutation(() => Card)
  createCard(@Args("createCardInput") createCardInput: CreateCardInput) {
    return this.cardsService.create(createCardInput);
  }

  @Query(() => [Card], { name: "cards" })
  findAll() {
    return this.cardsService.findAll();
  }

  @Query(() => Card, { name: "card" })
  findOne(@Args("id") id: string) {
    return this.cardsService.findOne(id);
  }

  @ResolveField(() => User)
  user(@Parent() card: Card): Promise<User> {
    return this.cardsService.getCardOwner(card.userId);
  }

  @Mutation(() => Card)
  updateCard(@Args("updateCardInput") updateCardInput: UpdateCardInput) {
    return this.cardsService.update(updateCardInput.id, updateCardInput);
  }

  @Mutation(() => Card)
  removeCard(@Args("id") id: string) {
    return this.cardsService.remove(id);
  }
}
