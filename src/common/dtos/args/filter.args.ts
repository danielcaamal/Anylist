import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';


@ArgsType()
export class FilterArgs {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    advancedSearch?: string = null;
} 