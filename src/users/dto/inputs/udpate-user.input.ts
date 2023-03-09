import { Field, ID, PartialType } from "@nestjs/graphql";
import { IsUUID, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { CreateUserInput } from "./create-user.input";
import { ValidRoles } from "src/auth/enums/valid-roles.enum";


export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field(() => ID)
    @IsUUID()
    id: string;

    @Field(() => [ValidRoles], { nullable: true })
    @IsArray()
    @IsOptional()
    roles?: ValidRoles[];

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}