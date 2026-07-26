import { Injectable } from "@nestjs/common";
import { PrismaService } from "../_prisma_nestjs/prisma.service.js";
import { UnboxUnique } from "../.utils/Unbox.js";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}

    async findOne(username:string) {
        return await this.prisma.users.findUnique({where: {user_username: username}});
    }

    async listAllUsers(){
        return await this.prisma.users.findMany();
    }

    async newUser (userData:any) {
        const { labName, firstName, middleName, lastName, phoneNumber, username, password } = userData;
        const lab_id = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw`CALL get_lab_id(${labName}, @lab_id);`;
            return UnboxUnique(await tx.$queryRaw`SELECT @lab_id;`);
        })
        const securedPassword = await bcrypt.hash(password, 10);
        const result = this.prisma.users.create({
            data: {
                lab_id: lab_id,
                role_id: 1,
                user_first_name: firstName,
                user_middle_name: middleName,
                user_last_name: lastName,
                user_phone_number: phoneNumber,
                user_username: username,
                user_password: securedPassword
            }
        })
        return result;
    }
    
}