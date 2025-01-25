import { Doctor } from "src/users/entities/doctor.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Record {
    @PrimaryGeneratedColumn()
    id !: number
    
    @Column()
    date !: Date

    @ManyToOne(() => User, (user) => user.records)
    user !: User

    @ManyToOne(() => Doctor, (doctor) => doctor.records, {eager : true, onDelete : "CASCADE"})
    doctor !: Doctor
}
