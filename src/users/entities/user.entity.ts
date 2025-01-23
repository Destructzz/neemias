import { Record } from "src/records/entities/record.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Role } from "./role.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id !: number

    @Column({type : "varchar", length : 50})
    username !: string

    @Column()
    hash !: string

    @OneToMany(() => Record, (record) => record.user, {eager : true})
    records !: Record[]

    @ManyToMany(() => Role, (role) => role.users, {eager : true})
    @JoinTable()
    roles !: Role[]
}
