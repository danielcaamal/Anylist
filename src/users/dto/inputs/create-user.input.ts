import { Field, ID, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsEmail()
    email: string;
    
    @Field(() => String)
    @IsString()
    @Length(8, 20)
    password: string;
    
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    fullName: string;
}