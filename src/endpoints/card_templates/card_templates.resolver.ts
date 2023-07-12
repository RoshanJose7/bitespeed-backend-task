import {
  Args,
  Query,
  Parent,
  Mutation,
  Resolver,
  ResolveField,
} from "@nestjs/graphql";

import { CardTemplate } from "./entities/card_template.entity";
import { CardTemplatesService } from "./card_templates.service";
import { CardTemplateLink } from "./entities/card_template_link.entity";
import { CreateCardTemplateInput } from "./dto/create-card_template.input";
import { UpdateCardTemplateInput } from "./dto/update-card_template.input";
import { CreateCardTemplateLinkInput } from "./dto/create-card_template_link.input";
import { UpdateCardTemplateLinkInput } from "./dto/update-card_template_link.input";

@Resolver(() => CardTemplate)
export class CardTemplatesResolver {
  constructor(private readonly cardTemplatesService: CardTemplatesService) {}

  @Mutation(() => CardTemplate)
  createCardTemplate(
    @Args("createCardTemplateInput")
    createCardTemplateInput: CreateCardTemplateInput,
  ) {
    return this.cardTemplatesService.create(createCardTemplateInput);
  }

  @Mutation(() => CardTemplateLink)
  createCardTemplateLink(
    @Args("createCardTemplateLinkInput")
    createCardTemplateLinkInput: CreateCardTemplateLinkInput,
  ) {
    return this.cardTemplatesService.createLink(createCardTemplateLinkInput);
  }

  @Query(() => [CardTemplate], { name: "cardTemplates" })
  findAll() {
    return this.cardTemplatesService.findAll();
  }

  @Query(() => [CardTemplateLink], { name: "cardTemplateLinks" })
  findAllLinks() {
    return this.cardTemplatesService.findAllLinks();
  }

  @Query(() => CardTemplate, { name: "cardTemplate" })
  findOne(@Args("id") id: string) {
    return this.cardTemplatesService.findOne(id);
  }

  @Query(() => CardTemplateLink, { name: "cardTemplateLink" })
  findOneLink(@Args("id") id: string) {
    return this.cardTemplatesService.findOneLink(id);
  }

  @Mutation(() => CardTemplate)
  updateCardTemplate(
    @Args("updateCardTemplateInput")
    updateCardTemplateInput: UpdateCardTemplateInput,
  ) {
    return this.cardTemplatesService.update(
      updateCardTemplateInput.id,
      updateCardTemplateInput,
    );
  }

  @Mutation(() => CardTemplateLink)
  updateCardTemplateLink(
    @Args("updateCardTemplateLinkInput")
    updateCardTemplateLinkInput: UpdateCardTemplateLinkInput,
  ) {
    return this.cardTemplatesService.updateLink(
      updateCardTemplateLinkInput.id,
      updateCardTemplateLinkInput,
    );
  }

  @Mutation(() => CardTemplate)
  removeCardTemplate(@Args("id") id: string) {
    return this.cardTemplatesService.remove(id);
  }

  @Mutation(() => CardTemplateLink)
  removeCardTemplateLink(@Args("id") id: string) {
    return this.cardTemplatesService.removeLink(id);
  }

  // Internal Resolvers
  @ResolveField(() => [CardTemplateLink])
  links(@Parent() cardTemplate: CardTemplate): Promise<CardTemplateLink[]> {
    const cardTemplateLinkPromises = cardTemplate.linkIds.map(
      (cardTemplateLinkId) =>
        this.cardTemplatesService.findOneLink(cardTemplateLinkId),
    );

    return Promise.all(cardTemplateLinkPromises);
  }
}
