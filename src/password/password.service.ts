import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class PasswordService {
    private readonly saltRounds = 10;

    async hashPassword(password : string){
        return await bcrypt.hash(password, this.saltRounds)
    }

    async comparePassword(password : string, hash : string){
        return await bcrypt.compare(password, hash)
    }
}
