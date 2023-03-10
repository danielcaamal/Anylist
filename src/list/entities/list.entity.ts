import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';

@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // Relacion, index('userId-list-index)
  
  @ManyToOne(() => User, user => user.lists, { nullable: false, lazy: true })
  @Index('user_id')
  @Field( () => User )
  user: User;

  @OneToMany(() => ListItem, listItem => listItem.list, { nullable: false, lazy: true })
  @Field( () => [ListItem])
  listItem: ListItem[];
}
