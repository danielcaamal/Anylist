import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  
  @Field(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID)
  listId: string;

  @Field(() => ID)
  itemId: string;
}
