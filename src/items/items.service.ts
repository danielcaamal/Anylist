import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

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

  async findAll(createBy: User): Promise<Item[]> {
    // TODO: filtrar, paginar, por usuario...
    return this.itemsRepository.find({
      where: {
        user: {
          id: createBy.id
        }
      }
    });
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
