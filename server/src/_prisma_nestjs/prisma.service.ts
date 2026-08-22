import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../_prisma_generated/client.js';
import { PrismaMariaDb as PrismaMysqlAdapter } from '@prisma/adapter-mariadb'

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        console.log('🔥 CREANDO PrismaService');

        const adapter = new PrismaMysqlAdapter({
            database: process.env.MYSQL_DATABASE,
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT!),
            user: process.env.MYSQL_ROOT_USER,
            password: process.env.MYSQL_ROOT_PASSWORD,
            connectionLimit: 5,
            allowPublicKeyRetrieval: true,
        }); 
        super({adapter});
    }
}