import 'dotenv/config'
import bcrypt from "bcrypt";
import { PrismaService } from "../src/_prisma_nestjs/prisma.service.js";

export class Seeder {
    async start(){
        const prisma = new PrismaService();
        const roles = await prisma.roles.createMany({
            data: [
                {
                    role_name: "ADMIN"
                },
                {
                    role_name: "USER"
                },
            ],
            skipDuplicates: true
        })
            
        const permissions = await prisma.permissions.createMany({
            data: [
                {
                    permission_name: "users.modify_self"
                },
                {
                    permission_name: "users.modify_others"
                },
                {
                    permission_name: "users.approve_new_signups"
                },
                {
                    permission_name: "users.visualize_confidential"
                }
            ],
            skipDuplicates: true
        })

        const admin = await prisma.users.upsert({
            where: {user_username: "Admin0"},
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

        const locations_labs = await prisma.locations.createMany({
            data: [
                {
                    location_building: 'A',
                    location_type: "LABORATORIO"
                },
                {
                    location_building: 'A',
                    location_type: "LABORATORIO"
                },
                {
                    location_building: 'A',
                    location_type: "LABORATORIO"
                },
                {
                    location_building: 'A',
                    location_type: "LABORATORIO"
                }
            ],
            skipDuplicates: true
        })

        const labs = await prisma.labs.createMany({
            data: [
                {
                    lab_id: 1, 
                    lab_name: "ALIMENTOS"
                },
                {
                    lab_id: 2,
                    lab_name: "EDAFOLOGIA",
                },
                {
                    lab_id: 3,
                    lab_name: "BIOTECNOLOGIA"
                },
                {
                    lab_id: 4,
                    lab_name: "BIOLOGIA_CELULAR"
                }
            ],
            skipDuplicates: true
        })

        const shelves = await prisma.shelves.createMany({
            data: [
                {
                    shelf_category: "ROJO",
                },
                {
                    shelf_category: "VERDE",
                },
                {
                    shelf_category: "BLANCO",
                },
                {
                    shelf_category: "AZUL"
                }
            ],
            skipDuplicates: true
        })

        const locations_shelf_levels = await prisma.locations.createMany({
            data: [
                /* LOCALIZACIONES DE ID'S 5-8 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'ROJO'*/
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },

                /* LOCALIZACIONES DE ID'S 9-12 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'VERDE'*/
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },

                /* LOCALIZACIONES DE ID'S 13-16 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'BLANCO'*/
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },

                /* LOCALIZACIONES DE ID'S 17-20 REFERENTES A LOS NIVELES DEL ANAQUEL DE NIVEL DE PELIGROSIDAD 'AZUL'*/
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                },
                {
                    location_building: 'A',
                    location_type: "NIVEL_ANAQUEL"
                }
            ],
            skipDuplicates: true
        })

        const shelf_levels = await prisma.shelf_levels.createMany({
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
    }
}
