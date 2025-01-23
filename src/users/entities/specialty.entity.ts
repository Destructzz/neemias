import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./doctor.entity";


@Entity()
export class Specialty{
    @PrimaryGeneratedColumn()
    id !: number

    @Column()
    name !: string

    @OneToMany(() => Doctor, (doctor) => doctor.specialty)
    doctors !: Doctor[]
}