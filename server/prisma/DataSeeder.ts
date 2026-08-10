import 'dotenv/config'
import bcrypt from "bcrypt";
import { PrismaService } from "../src/_prisma_nestjs/prisma.service.js";
import { ReagentService } from '../src/reagents/reagent.service.js';

export class Seeder {
    async start(){
        const prisma = new PrismaService();
        const seederStatus = await prisma.seeder_status.findUnique({
            where: { seeder_id: 1 },
            select: { seeder_status: true }
        })

        if(seederStatus!.seeder_status == 0) {
            await prisma.roles.createMany({
                data: [
                    { role_name: "ADMIN" },
                    { role_name: "USER" },
                ],
                skipDuplicates: true
            })

            await prisma.permissions.createMany({
                data: [
                    { permission_name: "permissions.users.modify_self" },
                    { permission_name: "permissions.users.modify_others" },
                    { permission_name: "permissions.users.approve_new_signups" }
                ],
                skipDuplicates: true
            })

            await prisma.roles_permissions.createMany({
                data: [
                    {
                        role_id: 1,         //ROLE: ADMIN
                        permission_id: 1    //PERMIT: permissions.users.modify_self
                    },
                    {
                        role_id: 1,         //ROLE: ADMIN
                        permission_id: 2    //PERMIT: permissions.users.modify_others
                    },
                    {
                        role_id: 1,         //ROLE: ADMIN
                        permission_id: 3    //PERMIT: permissions.users.approve_new_signups
                    },
                    {
                        role_id: 2,         //ROLE: USER
                        permission_id: 1    //PERMIT: permissions.users.approve_new_signups
                    }
                ],
                skipDuplicates: true
            })

            await prisma.users.upsert({
                where: { user_username: "Admin0" },
                update: {},
                create: {
                    role_id: 1,
                    user_first_name: "AdminFirstName",
                    user_middle_name: "AdminMiddleName",
                    user_last_name: "AdminLastName",
                    user_phone_number: "+XX-XXX-XXX-XXXX",
                    user_status: 1,
                    user_username: "Admin0",
                    user_password: await bcrypt.hash("ChangeThisPassword!", 10)
                }
            })

            await prisma.locations.createMany({
                data: [
                    { location_type: "LAB" },
                    { location_type: "LAB" },
                    { location_type: "LAB" },
                    { location_type: "LAB" }
                ],
                skipDuplicates: true
            })

            await prisma.labs.createMany({
                data: [
                    {
                        lab_id: 1, 
                        lab_name: "ALIMENTOS",
                        host_building: "A"
                    },
                        {
                        lab_id: 2,
                        lab_name: "EDAFOLOGIA",
                        host_building: "A"
                    },
                    {
                        lab_id: 3,
                        lab_name: "BIOTECNOLOGIA",
                        host_building: "A"

                    },
                    {
                        lab_id: 4,
                        lab_name: "BIOLOGIA_CELULAR",
                        host_building: "A"
                    }
                ],
                skipDuplicates: true
            })

            await prisma.shelves.createMany({
                data: [
                    {
                        shelf_category: "ROJO",
                        shelf_number: 1,
                        host_building: "A"
                    },
                    {
                        shelf_category: "VERDE",
                        shelf_number: 2,
                        host_building: "A"
                    },
                    {
                        shelf_category: "BLANCO",
                        shelf_number: 3,
                        host_building: "A"
                    },
                    {
                        shelf_category: "AZUL",
                        shelf_number: 4,
                        host_building: "A"
                    }
                ],
                skipDuplicates: true
            })

            await prisma.locations.createMany({
                data: [
                    /* LOCALIZACIONES DE ID'S 5-8 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'ROJO'*/
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },

                    /* LOCALIZACIONES DE ID'S 9-12 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'VERDE'*/
                        
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },

                    /* LOCALIZACIONES DE ID'S 13-16 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'BLANCO'*/
                        
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },

                    /* LOCALIZACIONES DE ID'S 17-20 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'AZUL'*/
                        
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                    { location_type: "SHELF_LVL" },
                ],
                skipDuplicates: true
            })

            await prisma.shelf_levels.createMany({
                data: [
                        /* NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'ROJO' */
                    {
                        shelf_level_id: 5,
                        shelf_id: 1,
                        shelf_level_number: 1
                    },
                    {
                        shelf_level_id: 6,
                        shelf_id: 1,
                        shelf_level_number: 2
                    },
                    {
                        shelf_level_id: 7,
                        shelf_id: 1,
                        shelf_level_number: 3
                    },
                    {
                        shelf_level_id: 8,
                        shelf_id: 1,
                        shelf_level_number: 4
                    },

                    /* NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'VERDE' */
                    {
                        shelf_level_id: 9,
                        shelf_id: 2,
                        shelf_level_number: 1
                    },
                    {
                        shelf_level_id: 10,
                        shelf_id: 2,
                        shelf_level_number: 2
                    },
                    {
                        shelf_level_id: 11,
                        shelf_id: 2,
                        shelf_level_number: 3
                    },
                    {
                        shelf_level_id: 12,
                        shelf_id: 2,
                        shelf_level_number: 4
                    },

                    /* NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'BLANCO' */
                    {
                        shelf_level_id: 13,
                        shelf_id: 3,
                        shelf_level_number: 1
                    },
                    {
                        shelf_level_id: 14,
                        shelf_id: 3,
                        shelf_level_number: 2
                    },
                    {
                        shelf_level_id: 15,
                        shelf_id: 3,
                        shelf_level_number: 3
                    },
                    {
                        shelf_level_id: 16,
                        shelf_id: 3,
                        shelf_level_number: 4
                    },

                    /* NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'AZUL' */
                    {
                        shelf_level_id: 17,
                        shelf_id: 4,
                        shelf_level_number: 1
                    },
                    {
                        shelf_level_id: 18,
                        shelf_id: 4,
                        shelf_level_number: 2
                    },
                    {
                        shelf_level_id: 19,
                        shelf_id: 4,
                        shelf_level_number: 3
                    },
                    {
                        shelf_level_id: 20,
                        shelf_id: 4,
                        shelf_level_number: 4
                    },
                ],
                skipDuplicates: true
            })

            const reagents = await prisma.reagents.findMany({
                select: { reagent_id: true }
            });

            const reagentService = new ReagentService(prisma);
            let counter = 1;
                    
            for (const reagent of reagents) {
                const reagent_code: string = await reagentService.generateCode(reagent.reagent_id);
                console.log(counter + ".- " + reagent_code)
                counter += 1
                await prisma.reagents.update({
                    where: { reagent_id: reagent.reagent_id },
                    data: { reagent_code: reagent_code }
                });
            }

            await prisma.seeder_status.update({
                where: { seeder_id: 1 },
                data: { seeder_status: 1 }
            })
            
            prisma.$disconnect;

        } /* END OF IF CASE*/

    } /* END OF METHOD */

} /* END OF CLASS */
