import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id !: number

    @Column({unique : true})
    name !: string

    @ManyToMany(() => User, (user) => user.roles, {onDelete : "CASCADE"})
    users !: User[]
}