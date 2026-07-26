import 'dotenv/config'
import { PrismaService } from "../src/_prisma_nestjs/prisma.service.js";
import { DockerManager } from '../_tools/DockerManager.js';
import { NestManager } from '../_tools/NestManager.js';
import { Seeder } from '../prisma/DataSeeder.js';
import { ServerShutdown } from './ServerShutdown.js';
import chalk from 'chalk';

const prisma = new PrismaService();
const dockerManager = new DockerManager();
const nestManager = new NestManager();
const seederManager = new Seeder();

async function main(){
    //await dockerManager.start()
    //await dockerManager.waitUntilHealthy()
    await seederManager.start()
    await nestManager.start()
}

main()
.catch(async (error) => {
    console.log(chalk.red("< SISTEMA >: SE HA PRODUCIDO UN ERROR FATAL: " + error));
    new ServerShutdown().stopServices(1);
})
.finally(async () => {
    await prisma.$disconnect
})
