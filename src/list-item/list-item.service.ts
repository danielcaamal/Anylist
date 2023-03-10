import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';
import { PaginationArgs } from 'src/common/dtos/args';
import { FilterArgs } from '../common/dtos/args/filter.args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem) private readonly listItemsRepository: Repository<ListItem>
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });
    return await this.listItemsRepository.save( newItem );
  }

  async findAll(list: List, paginationArgs: PaginationArgs, filterArgs: FilterArgs): Promise<ListItem[]> {
    const { limit, offset, order } = paginationArgs;
    const { advancedSearch } = filterArgs;

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where( '"listId" = :listId', { listId: list.id } );

    if ( advancedSearch ) {
      queryBuilder.where( 'LOWER(item.name) LIKE :name', { name: `%${list.name.toLowerCase()}%` } );
    }

    return await queryBuilder.getMany();
  }

  async countListItemsByList(list: List): Promise<number> {
    return this.listItemsRepository.countBy({ list: { id: list.id } });
  }

  async findOne(id: string) : Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });
    if ( !listItem ) throw new NotFoundException(`List with id: ${ id } not found`);
    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput) : Promise<ListItem> {
    const { itemId, listId, ...rest } = updateListItemInput;
    // const listItem = await this.listItemsRepository.preload({
    //   ...rest,
    //   list: { id: listId },
    //   item: { id: itemId },
    // })

    // if ( !listItem ) throw new NotFoundException(`List with id: ${ id } not found`);
    // return await this.listItemsRepository.save( listItem );

    // with query builder
    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .update(ListItem)
      .set({ ...rest })
      .where('"id" = :id', { id });
    
    if ( listId ) queryBuilder.set({ list: { id: listId } });
    if ( itemId ) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: string) {
    return `This action removes a #${id} listItem`;
  }
}
