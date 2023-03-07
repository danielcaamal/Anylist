import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class LoginInput {
    @Field(() => String)
    @IsEmail()
    email: string;
    
    @Field(() => String)
    @IsString()
    @Length(8, 20)
    password: string;
}