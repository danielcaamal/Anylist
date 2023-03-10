import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';

@ObjectType()
@Entity('listItem')
@Unique('listItem-item', ['list','item'])
export class ListItem {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, list => list.listItem, { nullable: false, lazy: true })
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, item => item.listItem, { nullable: false, lazy: true })
  @Field(() => Item)
  item: Item;
}
