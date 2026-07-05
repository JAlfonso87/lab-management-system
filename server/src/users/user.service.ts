import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { UnboxUnique } from "../.utils/Unbox.js";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}

    async findOne(username:string) {
        return await this.prisma.technicians.findUnique({where: {technician_username: username}});
    }

    async listAllUsers(){
        return await this.prisma.technicians.findMany();
    }

    async newUser (userData:any) {
        const { labName, firstName, middleName, lastName, phoneNumber, username, password } = userData;
        const lab_id = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw`CALL get_lab_id(${labName}, @lab_id);`;
            return UnboxUnique(await tx.$queryRaw`SELECT @lab_id;`);
        })
        const securedPassword = await bcrypt.hash(password, 10);
        const result = this.prisma.technicians.create({
            data: {
                lab_id: lab_id,
                technician_first_name: firstName,
                technician_middle_name: middleName,
                technician_last_name: lastName,
                technician_phone_number: phoneNumber,
                technician_username: username,
                technician_password: securedPassword
            }
        })
        return result;
    }
    
}