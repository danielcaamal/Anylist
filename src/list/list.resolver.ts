import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { CurrentUser } from 'src/auth/decorators/currrent-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilterArgs, PaginationArgs } from 'src/common/dtos/args';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {
  constructor(
    private readonly listService: ListService,
    private readonly listItemService: ListItemService,
  ) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
    ) : Promise<List> {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'list' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() filterArgs: FilterArgs,
    ) : Promise<List[]>{
    return this.listService.findAll(user, paginationArgs, filterArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => Int }) id: string,
    @CurrentUser() user: User,
    ) : Promise<List> {
    return this.listService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
    ) : Promise<List> {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => Int }) id: string, 
    @CurrentUser() user: User,
    ) : Promise<List> {
    return this.listService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() filterArgs: FilterArgs,
    ): Promise<ListItem[]> {
    return await this.listItemService.findAll(list, paginationArgs, filterArgs);
  }

  @ResolveField(() => Int, { name: 'itemsCount' })
  async getListItemsCount(
    @Parent() list: List,
    ): Promise<number> {
    return await this.listItemService.countListItemsByList(list);
  }


}
