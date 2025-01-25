import { OmitType} from "@nestjs/mapped-types";
import { Specialty } from "../entities/specialty.entity";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSpecialtyDto extends OmitType(Specialty, ['id', 'doctors']){
    @IsNotEmpty()
    @IsString()
    name !: string
}