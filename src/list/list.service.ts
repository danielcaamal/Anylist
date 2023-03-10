import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FilterArgs, PaginationArgs } from 'src/common/dtos/args';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class ListService {

  constructor(
    @InjectRepository(List) private readonly listsRepository: Repository<List>
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newItem = this.listsRepository.create( { ...createListInput, user: user } )
    return await this.listsRepository.save( newItem );
  }

  async findAll(createBy: User, paginationArgs: PaginationArgs, filterArgs: FilterArgs): Promise<List[]> {
    const { limit, offset, order } = paginationArgs;
    const { advancedSearch } = filterArgs;

    const queryBuilder = this.listsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where( '"userId" = :userId', { userId: createBy.id } );

    if ( advancedSearch ) {
      queryBuilder.where( 'LOWER(name) LIKE :name', { name: `%${advancedSearch.toLowerCase()}%` } );
    }

    return await queryBuilder.getMany();
  }

  async findOne( id: string, createBy: User ): Promise<List> {
    const list = await this.listsRepository.findOneBy({ 
      id, user: { id: createBy.id } 
    })
    if ( !list ) throw new NotFoundException(`List with id: ${ id } not found`);
    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, updatedBy: User): Promise<List> {
    var user = await this.findOne( id, updatedBy );
    const list = await this.listsRepository.preload({ ...updateListInput, user });
    if ( !list ) throw new NotFoundException(`Item with id: ${ id } not found`);
    return this.listsRepository.save( list );

  }

  async remove( id: string, createdBy: User ):Promise<List> {
    // TODO: soft delete, integridad referencial
    const list = await this.findOne( id, createdBy );
    await this.listsRepository.remove( list );
    return { ...list, id };
  }

  async listCountByUser( user: User ): Promise<number> {
    return await this.listsRepository.countBy({ user: { id: user.id } });
  }
}
