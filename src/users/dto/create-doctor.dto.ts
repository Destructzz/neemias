import { OmitType } from "@nestjs/mapped-types";
import { Doctor } from "../entities/doctor.entity";
import { IsNotEmpty } from "class-validator";

export class CreateDoctorDto extends OmitType(Doctor, ['id', 'specialty', 'records']){
    @IsNotEmpty()
    firstName !: string;

    @IsNotEmpty()
    lastName !: string;

    @IsNotEmpty()
    middleName !: string;

    @IsNotEmpty()
    specialty !: string
}