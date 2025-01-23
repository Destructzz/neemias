import { OmitType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { IsNotEmpty, MaxLength, minLength, MinLength } from "class-validator";

export class CreateUserDto extends OmitType(User, ['id', 'hash', 'records']){
    @IsNotEmpty({message : 'username is required'})
    @MaxLength(50, {message : 'username must be most 50 characters long'})
    @MinLength(2, {message : 'username must be at least 2 characters long'})
    username: string;

    @IsNotEmpty({message : 'password is required'})
    @MaxLength(16, {message : 'passport must be most 50 characters long'})
    @MinLength(4, {message : 'password must be at least 4 characters long'})
    password !: string
}
