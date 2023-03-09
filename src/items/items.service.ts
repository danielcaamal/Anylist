import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, FilterArgs } from '../common/dtos/args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,

  ) {}


  async create( createItemInput: CreateItemInput, createdBy: User ): Promise<Item> {
    const newItem = this.itemsRepository.create( { ...createItemInput, user: createdBy } )
    return await this.itemsRepository.save( newItem );
  }

  async findAll(createBy: User, paginationArgs: PaginationArgs, filterArgs: FilterArgs): Promise<Item[]> {
    const { limit, offset, order } = paginationArgs;
    const { advancedSearch } = filterArgs;

    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where( '"userId" = :userId', { userId: createBy.id } );

    if ( advancedSearch ) {
      queryBuilder.where( 'LOWER(name) LIKE :name', { name: `%${advancedSearch.toLowerCase()}%` } );
    }

    return await queryBuilder.getMany();
    // return this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: createBy.id
    //     },
    //     name: Like(`%${advancedSearch}%`)
    //   }
    // });
  }

  async findOne( id: string, createBy: User ): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ 
      id,
      user: {
        id: createBy.id
      } 
    })

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, updatedBy: User): Promise<Item> {
    var user = await this.findOne( id, updatedBy );
    const item = await this.itemsRepository.preload({ ...updateItemInput, user });
    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);
    return this.itemsRepository.save( item );

  }

  async remove( id: string, createdBy: User ):Promise<Item> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne( id, createdBy );
    await this.itemsRepository.remove( item );
    return { ...item, id };
  }

  async itemCountByUser( user: User ): Promise<number> {
    return await this.itemsRepository.countBy({ user: { id: user.id } });
  }
}
