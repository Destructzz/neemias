import { Column, Entity, ManyToOne,OneToMany,PrimaryGeneratedColumn } from "typeorm";
import { Specialty } from "./specialty.entity";
import { Record } from "src/records/entities/record.entity";


@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id !: number

    @Column()
    firstName !: string

    @Column()
    lastName !: string

    @Column()
    middleName !: string

    @ManyToOne(() => Specialty, (specialty) => specialty.doctors,{eager: true, onDelete : 'CASCADE'})
    specialty !: Specialty

    @OneToMany(() => Record, (record) => record.doctor, {onDelete : "CASCADE"})
    records !: Record[]
}