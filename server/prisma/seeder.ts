import 'dotenv/config';
import bcrypt from 'bcrypt';

import { PrismaService } from '../src/_prisma_nestjs/prisma.service.js';
import { Prisma } from '../src/_prisma_generated/client.js';
import { ReagentService } from '../src/reagents/reagent.service.js';

/* ============================================================
 * CONFIGURATION
 * ============================================================ */

type SeedScale = 'small' | 'medium' | 'large';

interface SeedConfig {
  reagents: number;
  labs: number;
  shelves: number;

  adminUsers: number;
  warehouseUsers: number;
  labUsers: number;

  historicalRestocks: number;
  requests: number;
  transfers: number;
}

const SCALE_CONFIGS: Record<SeedScale, SeedConfig> = {
  small: {
    reagents: 100,
    labs: 8,
    shelves: 20,

    adminUsers: 1,
    warehouseUsers: 3,
    labUsers: 12,

    historicalRestocks: 2_000,
    requests: 5_000,
    transfers: 2_000,
  },

  medium: {
    reagents: 500,
    labs: 15,
    shelves: 60,

    adminUsers: 2,
    warehouseUsers: 6,
    labUsers: 35,

    historicalRestocks: 20_000,
    requests: 50_000,
    transfers: 20_000,
  },

  large: {
    reagents: 1_500,
    labs: 30,
    shelves: 150,

    adminUsers: 3,
    warehouseUsers: 10,
    labUsers: 70,

    historicalRestocks: 50_000,
    requests: 150_000,
    transfers: 60_000,
  },
};

const scale = (process.env.SEED_SCALE ?? 'small') as SeedScale;
const config = SCALE_CONFIGS[scale];

if (!config) {
  throw new Error(
    `SEED_SCALE inválido: "${scale}". Usa small, medium o large.`,
  );
}

const SEED = Number(process.env.SEED ?? '20260926');

const SIMULATION_START = new Date(
  process.env.SEED_START ?? '2023-01-01T00:00:00.000Z',
);

const SIMULATION_END = new Date(
  process.env.SEED_END ?? '2025-12-31T23:59:59.999Z',
);

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD ?? 'ChangeThisPassword!';

const BATCH_SIZE = 2_000;

/* ============================================================
 * STATIC CATALOGS
 * ============================================================ */

const BUILDINGS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const SHELF_CATEGORIES = ['ROJO', 'VERDE', 'BLANCO', 'AMARILLO', 'AZUL'];

const LAB_NAMES = [
  'ALIMENTOS',
  'EDAFOLOGIA',
  'BIOTECNOLOGIA',
  'BIOLOGIA_CELULAR',
  'QUIMICA_GENERAL',
  'QUIMICA_ANALITICA',
  'MICROBIOLOGIA',
  'FISICOQUIMICA',
  'BIOQUIMICA',
  'FARMACOLOGIA',
  'GENETICA',
  'BIOLOGIA_MOLECULAR',
  'ECOLOGIA',
  'BOTANICA',
  'ZOOLOGIA',
  'ENTOMOLOGIA',
  'PARASITOLOGIA',
  'SUELOS_Y_AGUA',
  'INSTRUMENTAL',
  'INGENIERIA_AMBIENTAL',
  'TECNOLOGIA_ALIMENTARIA',
  'FERMENTACION',
  'CULTIVO_TISULAR',
  'CALIDAD_AGUA',
  'BROMATOLOGIA',
  'NUTRICION',
  'FITOPATOLOGIA',
  'BIORREMEDIACION',
  'ANALISIS_INDUSTRIAL',
  'LABORATORIO_CENTRAL',
];

const CHEMICALS = [
  'SODIUM CHLORIDE',
  'POTASSIUM CHLORIDE',
  'CALCIUM CHLORIDE',
  'MAGNESIUM SULFATE',
  'SODIUM SULFATE',
  'POTASSIUM SULFATE',
  'SODIUM HYDROXIDE',
  'POTASSIUM HYDROXIDE',
  'CALCIUM HYDROXIDE',
  'AMMONIUM HYDROXIDE',
  'HYDROCHLORIC ACID',
  'NITRIC ACID',
  'SULFURIC ACID',
  'ACETIC ACID',
  'CITRIC ACID',
  'PHOSPHORIC ACID',
  'OXALIC ACID',
  'BORIC ACID',
  'SODIUM ACETATE',
  'POTASSIUM PERMANGANATE',
  'SODIUM THIOSULFATE',
  'SODIUM BICARBONATE',
  'SODIUM CARBONATE',
  'POTASSIUM CARBONATE',
  'AMMONIUM CHLORIDE',
  'AMMONIUM SULFATE',
  'AMMONIUM NITRATE',
  'UREA',
  'GLUCOSE',
  'SUCROSE',
  'ETHANOL',
  'METHANOL',
  'ISOPROPANOL',
  'ACETONE',
  'ACETONITRILE',
  'ETHYL ACETATE',
  'HEXANE',
  'TOLUENE',
  'XYLENE',
  'GLYCEROL',
  'FORMALDEHYDE SOLUTION',
  'PHENOL',
  'CHLOROFORM',
  'DIETHYL ETHER',
  'HYDROGEN PEROXIDE',
  'SODIUM HYPOCHLORITE',
  'COPPER SULFATE',
  'FERROUS SULFATE',
  'FERRIC CHLORIDE',
  'ZINC SULFATE',
];

const REAGENT_VARIANTS = [
  'ACS 100 mL',
  'ACS 250 mL',
  'ACS 500 mL',
  'ACS 1 L',
  'ACS 2.5 L',

  'P.A. 100 g',
  'P.A. 250 g',
  'P.A. 500 g',
  'P.A. 1 kg',
  'P.A. 2 kg',

  'REAGENT 100 mL',
  'REAGENT 250 mL',
  'REAGENT 500 mL',
  'REAGENT 1 L',
  'REAGENT 2.5 L',

  'ANALYTICAL 100 g',
  'ANALYTICAL 250 g',
  'ANALYTICAL 500 g',
  'ANALYTICAL 1 kg',
  'ANALYTICAL 2 kg',

  'STANDARD 100 mL',
  'STANDARD 250 mL',
  'STANDARD 500 mL',
  'STANDARD 1 L',
  'STANDARD 2.5 L',

  'SOLUTION 100 mL',
  'SOLUTION 250 mL',
  'SOLUTION 500 mL',
  'SOLUTION 1 L',
  'SOLUTION 2.5 L',
];

const BRANDS = [
  'MERCK',
  'SIGMA',
  'JTBaker',
  'AVANTOR',
  'MEYER',
  'HYCEL',
  'CTR',
  'FISHER',
  'BIO-RAD',
  'ALFA',
];

const FIRST_NAMES = [
  'Juan',
  'Ana',
  'Luis',
  'Maria',
  'Carlos',
  'Sofia',
  'Miguel',
  'Laura',
  'Daniel',
  'Fernanda',
  'Jorge',
  'Patricia',
  'Roberto',
  'Andrea',
  'Diego',
  'Valeria',
  'Alejandro',
  'Camila',
  'Eduardo',
  'Gabriela',
];

const LAST_NAMES = [
  'Garcia',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Rodriguez',
  'Perez',
  'Sanchez',
  'Ramirez',
  'Torres',
  'Flores',
  'Rivera',
  'Vargas',
  'Mendoza',
  'Castillo',
  'Ortega',
  'Morales',
  'Navarro',
  'Rojas',
  'Reyes',
];

/* ============================================================
 * TYPES
 * ============================================================ */

type TransferDirection = 'LAB_TO_LAB' | 'SHELF_TO_LAB' | 'SHELF_TO_SHELF';

type EventType = 'RESTOCK' | 'TRANSFER' | 'REQUEST';

interface EventShell {
  type: EventType;
  date: Date;
  sequence: number;
}

interface StockState {
  local_stock_id: number;
  reagent_id: number;
  location_id: number;

  kind: 'LAB' | 'SHELF_LVL';
  risk: string;

  lab_id: number | null;

  units: number;
}

interface LabRecord {
  lab_id: number;
  lab_name: string;
  host_building: string;
}

interface ReagentRecord {
  reagent_id: number;
  reagent_name: string;
  reagent_brand: string;
  reagent_netweight: string;
  reagent_risk: string | null;
  reagent_code: string | null;
}

/* ============================================================
 * DETERMINISTIC RNG
 * ============================================================ */

class RandomGenerator {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)]!;
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

function weightedPick<T>(
  rng: RandomGenerator,
  values: T[],
  weights: number[],
): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  let value = rng.next() * total;

  for (let i = 0; i < values.length; i++) {
    value -= weights[i]!;
    if (value <= 0) {
      return values[i]!;
    }
  }

  return values[values.length - 1]!;
}

function pickDistinct<T>(
  rng: RandomGenerator,
  source: T[],
  amount: number,
): T[] {
  if (amount >= source.length) {
    return [...source];
  }

  const copy = [...source];

  for (let i = 0; i < amount; i++) {
    const j = rng.int(i, copy.length - 1);

    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }

  return copy.slice(0, amount);
}

/* ============================================================
 * DATE HELPERS
 * ============================================================ */

function dateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function randomOperationalDate(
  rng: RandomGenerator,
  start: Date,
  end: Date,
): Date {
  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();

  const years: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  // Slight growth over the years.
  const yearWeights = years.map((_, index) => 0.8 + index * 0.2);

  const year = weightedPick(rng, years, yearWeights);

  // Academic seasonality.
  const monthWeights = [
    0.6, // Jan
    1.0, // Feb
    1.05, // Mar
    1.05, // Apr
    1.15, // May
    0.9, // Jun
    0.35, // Jul
    1.2, // Aug
    1.15, // Sep
    1.1, // Oct
    0.9, // Nov
    0.3, // Dec
  ];

  const month = weightedPick(
    rng,
    Array.from({ length: 12 }, (_, i) => i),
    monthWeights,
  );

  const day = rng.int(1, daysInMonth(year, month));

  let result = new Date(Date.UTC(year, month, day));

  if (result < start) {
    result = dateOnly(start);
  }

  if (result > end) {
    result = dateOnly(end);
  }

  return result;
}

function randomDateTime(rng: RandomGenerator, date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      rng.int(7, 18),
      rng.int(0, 59),
      rng.int(0, 59),
    ),
  );
}

/* ============================================================
 * GENERIC BATCHING
 * ============================================================ */

function chunks<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/* ============================================================
 * SEEDER
 * ============================================================ */

export class Seeder {
  async start(): Promise<void> {
    const prisma = new PrismaService();
    const rng = new RandomGenerator(SEED);

    try {
      /*
       * seeder_status is metadata, so it is checked before
       * the actual domain data. The FIRST domain data inserted
       * by this seeder is reagents.
       */

      const seederStatus = await prisma.seeder_status.upsert({
        where: {
          seeder_id: 1,
        },
        update: {},
        create: {
          seeder_id: 1,
          seeder_status: 0,
        },
      });

      if (seederStatus.seeder_status === 1) {
        console.log('Seeder ya ejecutado. No se realizará ninguna operación.');
        return;
      }

      await this.assertFreshDatabase(prisma);

      console.log('');
      console.log('==========================================');
      console.log(' SYNTHETIC UNIVERSITY INVENTORY SEED');
      console.log('==========================================');
      console.log(`Scale: ${scale}`);
      console.log(`Seed: ${SEED}`);
      console.log(
        `Period: ${SIMULATION_START.toISOString()} -> ${SIMULATION_END.toISOString()}`,
      );
      console.log('');

      /*
       * ====================================================
       * 1. REAGENTS
       * ====================================================
       */

      console.log('1/7 - Generando reactivos...');

      const reagents = await this.seedReagents(prisma, rng);

      console.log(`      ${reagents.length} reactivos creados.`);

      /*
       * ====================================================
       * 2. ROLES & PERMISSIONS
       * ====================================================
       */

      console.log('2/7 - Generando roles y permisos...');

      const roleData = await this.seedRolesAndPermissions(prisma);

      /*
       * ====================================================
       * 3. PHYSICAL INFRASTRUCTURE
       * ====================================================
       */

      console.log('3/7 - Generando infraestructura...');

      const infrastructure = await this.seedInfrastructure(prisma, rng);

      /*
       * ====================================================
       * 4. USERS
       * ====================================================
       */

      console.log('4/7 - Generando usuarios...');

      const users = await this.seedUsers(
        prisma,
        rng,
        infrastructure.labs,
        roleData,
      );

      /*
       * ====================================================
       * 5. LOCAL STOCKS
       * ====================================================
       */

      console.log('5/7 - Generando local_stocks...');

      const stocks = await this.seedLocalStocks(
        prisma,
        rng,
        reagents,
        infrastructure.labs,
        infrastructure.shelfLevels,
        users,
      );

      console.log(`      ${stocks.length} local_stocks creados.`);

      /*
       * ====================================================
       * 6. INITIAL INVENTORY + HISTORY
       * ====================================================
       */

      console.log('6/7 - Construyendo inventario inicial e historial...');

      await this.seedInitialInventory(prisma, rng, stocks, users);

      await this.simulateHistory(prisma, rng, reagents, stocks, users);

      /*
       * ====================================================
       * 7. VALIDATION
       * ====================================================
       */

      console.log('7/7 - Validando integridad...');

      await this.updateFinalStocks(prisma, stocks);

      await this.validateResult(prisma);

      await prisma.seeder_status.update({
        where: {
          seeder_id: 1,
        },
        data: {
          seeder_status: 1,
        },
      });

      console.log('');
      console.log('==========================================');
      console.log(' SEED COMPLETADO CORRECTAMENTE');
      console.log('==========================================');
      console.log('');
    } catch (error) {
      console.error('');
      console.error('ERROR DURANTE EL SEED:');
      console.error(error);

      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  /* ========================================================
   * FRESH DATABASE VALIDATION
   * ======================================================== */

  private async assertFreshDatabase(prisma: PrismaService): Promise<void> {
    const [
      reagents,
      labs,
      locations,
      shelves,
      users,
      localStocks,
      requests,
      restocks,
      transfers,
    ] = await Promise.all([
      prisma.reagents.count(),
      prisma.labs.count(),
      prisma.locations.count(),
      prisma.shelves.count(),
      prisma.users.count(),
      prisma.local_stocks.count(),
      prisma.requests.count(),
      prisma.restocks.count(),
      prisma.transfer.count(),
    ]);

    const values = {
      reagents,
      labs,
      locations,
      shelves,
      users,
      localStocks,
      requests,
      restocks,
      transfers,
    };

    const nonEmpty = Object.entries(values).filter(([, count]) => count > 0);

    if (nonEmpty.length > 0) {
      throw new Error(
        `La base de datos no está vacía. Datos encontrados: ${JSON.stringify(
          Object.fromEntries(nonEmpty),
          null,
          2,
        )}`,
      );
    }
  }

  /* ========================================================
   * REAGENTS
   * ======================================================== */

  private async seedReagents(
    prisma: PrismaService,
    rng: RandomGenerator,
  ): Promise<ReagentRecord[]> {
    if (config.reagents > CHEMICALS.length * REAGENT_VARIANTS.length) {
      throw new Error(
        'El catálogo sintético no tiene suficientes combinaciones.',
      );
    }

    const riskValues = ['ROJO', 'VERDE', 'BLANCO', 'AMARILLO', 'AZUL'];

    const riskWeights = [0.12, 0.25, 0.28, 0.15, 0.2];

    const data: Prisma.reagentsCreateManyInput[] = [];

    for (let i = 0; i < config.reagents; i++) {
      const chemicalIndex = Math.floor(i / REAGENT_VARIANTS.length);

      const variantIndex = i % REAGENT_VARIANTS.length;

      const base = CHEMICALS[chemicalIndex]!;

      const variant = REAGENT_VARIANTS[variantIndex]!;

      data.push({
        reagent_name: `${base} ${variant}`,

        reagent_brand: rng.pick(BRANDS),

        reagent_netweight:
          variant.split(' ').at(-2) + ' ' + variant.split(' ').at(-1),

        reagent_risk: weightedPick(rng, riskValues, riskWeights),

        reagent_code: null,
      });
    }

    for (const batch of chunks(data, BATCH_SIZE)) {
      await prisma.reagents.createMany({
        data: batch,
      });
    }

    /*
     * The existing ReagentService remains responsible
     * for the application's real reagent-code algorithm.
     */

    const reagentService = new ReagentService(prisma);

    const reagentIds = await prisma.reagents.findMany({
      select: {
        reagent_id: true,
      },
      orderBy: {
        reagent_id: 'asc',
      },
    });

    let counter = 1;

    for (const reagent of reagentIds) {
      const reagentCode = await reagentService.generateCode({
        reagentId: reagent.reagent_id,
      });

      await prisma.reagents.update({
        where: {
          reagent_id: reagent.reagent_id,
        },
        data: {
          reagent_code: reagentCode.toUpperCase(),
        },
      });

      if (counter % 100 === 0 || counter === reagentIds.length) {
        console.log(`      códigos: ${counter}/${reagentIds.length}`);
      }

      counter++;
    }

    return prisma.reagents.findMany({
      orderBy: {
        reagent_id: 'asc',
      },
    });
  }

  /* ========================================================
   * ROLES & PERMISSIONS
   * ======================================================== */

  private async seedRolesAndPermissions(prisma: PrismaService) {
    await prisma.roles.createMany({
      data: [
        {
          role_name: 'ADMIN',
        },
        {
          role_name: 'USER',
        },
      ],
    });

    await prisma.permissions.createMany({
      data: [
        {
          permission_name: 'permissions.users.modify_self',
        },
        {
          permission_name: 'permissions.users.modify_others',
        },
        {
          permission_name: 'permissions.users.approve_new_signups',
        },
      ],
    });

    const roles = await prisma.roles.findMany();

    const permissions = await prisma.permissions.findMany();

    const adminRole = roles.find((role) => role.role_name === 'ADMIN')!;

    const userRole = roles.find((role) => role.role_name === 'USER')!;

    const modifySelf = permissions.find(
      (permission) =>
        permission.permission_name === 'permissions.users.modify_self',
    )!;

    const modifyOthers = permissions.find(
      (permission) =>
        permission.permission_name === 'permissions.users.modify_others',
    )!;

    const approveSignups = permissions.find(
      (permission) =>
        permission.permission_name === 'permissions.users.approve_new_signups',
    )!;

    await prisma.roles_permissions.createMany({
      data: [
        {
          role_id: adminRole.role_id,
          permission_id: modifySelf.permission_id,
        },
        {
          role_id: adminRole.role_id,
          permission_id: modifyOthers.permission_id,
        },
        {
          role_id: adminRole.role_id,
          permission_id: approveSignups.permission_id,
        },
        {
          role_id: userRole.role_id,
          permission_id: modifySelf.permission_id,
        },
      ],
    });

    return {
      adminRoleId: adminRole.role_id,
      userRoleId: userRole.role_id,
    };
  }

  /* ========================================================
   * INFRASTRUCTURE
   * ======================================================== */

  private async seedInfrastructure(
    prisma: PrismaService,
    rng: RandomGenerator,
  ) {
    const labCount = config.labs;
    const shelfCount = config.shelves;
    const shelfLevelsPerShelf = 4;

    const totalShelfLevels = shelfCount * shelfLevelsPerShelf;

    const totalLocations = labCount + totalShelfLevels;

    /*
     * LAB locations:
     *   1 ... labCount
     *
     * SHELF LEVEL locations:
     *   labCount + 1 ... totalLocations
     */

    const locationData: Prisma.locationsCreateManyInput[] = [];

    for (let locationId = 1; locationId <= totalLocations; locationId++) {
      locationData.push({
        location_id: locationId,
        location_type: locationId <= labCount ? 'LAB' : 'SHELF_LVL',
      });
    }

    await prisma.locations.createMany({
      data: locationData,
    });

    /*
     * Labs
     */

    const labsData: Array<{
      lab_id: number;
      lab_name: string;
      host_building: string;
    }> = [];

    for (let i = 0; i < labCount; i++) {
      labsData.push({
        lab_id: i + 1,
        lab_name: LAB_NAMES[i]!,
        host_building: BUILDINGS[i % BUILDINGS.length]!,
      });
    }

    await prisma.labs.createMany({
      data: labsData,
    });

    /*
     * Shelves
     */

    const shelfData: Array<{
      shelf_number: number;
      shelf_category: string;
      host_building: string;
    }> = [];

    const shelfNumberByBuilding = new Map<string, number>();

    for (const building of BUILDINGS) {
      shelfNumberByBuilding.set(building, 1);
    }

    for (let i = 0; i < shelfCount; i++) {
      const building = BUILDINGS[i % BUILDINGS.length]!;

      const shelfNumber = shelfNumberByBuilding.get(building)!;

      shelfNumberByBuilding.set(building, shelfNumber + 1);

      shelfData.push({
        shelf_number: shelfNumber,

        shelf_category: SHELF_CATEGORIES[i % SHELF_CATEGORIES.length]!,

        host_building: building,
      });
    }

    await prisma.shelves.createMany({
      data: shelfData,
    });

    const shelves = await prisma.shelves.findMany({
      orderBy: {
        shelf_id: 'asc',
      },
    });

    /*
     * Shelf levels
     */

    const shelfIdByCompositeKey = new Map<string, number>();

    for (const shelf of shelves) {
      shelfIdByCompositeKey.set(
        `${shelf.host_building}:${shelf.shelf_number}`,
        shelf.shelf_id,
      );
    }

    const shelfLevelData: Prisma.shelf_levelsCreateManyInput[] = [];

    let nextShelfLocationId = labCount + 1;

    for (const shelf of shelfData) {
      const shelfId = shelfIdByCompositeKey.get(
        `${shelf.host_building}:${shelf.shelf_number}`,
      );

      if (!shelfId) {
        throw new Error('No fue posible encontrar el shelf_id generado.');
      }

      for (let level = 1; level <= 4; level++) {
        shelfLevelData.push({
          shelf_level_id: nextShelfLocationId,

          shelf_id: shelfId,

          shelf_level_number: level,
        });

        nextShelfLocationId++;
      }
    }

    await prisma.shelf_levels.createMany({
      data: shelfLevelData,
    });

    const labs = await prisma.labs.findMany({
      orderBy: {
        lab_id: 'asc',
      },
    });

    const shelfLevels = await prisma.shelf_levels.findMany({
      include: {
        shelves: {
          select: {
            shelf_category: true,
            shelf_number: true,
            host_building: true,
          },
        },
      },
      orderBy: {
        shelf_level_id: 'asc',
      },
    });

    return {
      labs: labs as LabRecord[],
      shelfLevels,
    };
  }

  /* ========================================================
   * USERS
   * ======================================================== */

  private async seedUsers(
    prisma: PrismaService,
    rng: RandomGenerator,
    labs: LabRecord[],
    roleData: {
      adminRoleId: number;
      userRoleId: number;
    },
  ) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const usersData: Array<{
      lab_id?: number | null;
      role_id: number;
      user_first_name: string;
      user_middle_name?: string | null;
      user_last_name: string;
      user_phone_number?: string | null;
      user_username: string;
      user_password: string;
      user_status: number;
    }> = [];

    /*
     * ADMIN USERS
     */

    for (let i = 1; i <= config.adminUsers; i++) {
      usersData.push({
        role_id: roleData.adminRoleId,

        user_first_name: FIRST_NAMES[(i - 1) % FIRST_NAMES.length]!,

        user_middle_name: null,

        user_last_name: LAST_NAMES[i % LAST_NAMES.length]!,

        user_phone_number: `+52-555-10-${String(i).padStart(4, '0')}`,

        user_username: `ADMIN${String(i).padStart(2, '0')}`,

        user_password: passwordHash,

        user_status: 1,

        lab_id: null,
      });
    }

    /*
     * LAB USERS
     */

    for (let i = 1; i <= config.labUsers; i++) {
      const lab = labs[(i - 1) % labs.length]!;

      usersData.push({
        role_id: roleData.userRoleId,

        user_first_name:
          FIRST_NAMES[(i + 10) % FIRST_NAMES.length]!.toUpperCase(),

        user_middle_name: null,

        user_last_name: LAST_NAMES[(i + 11) % LAST_NAMES.length]!.toUpperCase(),

        user_phone_number: `+52-555-30-${String(i).padStart(4, '0')}`,

        user_username: `LABUSER${String(i).padStart(3, '0')}`,

        user_password: passwordHash,

        user_status: 1,

        lab_id: lab.lab_id,
      });
    }

    for (const batch of chunks(usersData, BATCH_SIZE)) {
      await prisma.users.createMany({
        data: batch,
      });
    }

    return prisma.users.findMany({
      orderBy: {
        user_id: 'asc',
      },
    });
  }

  /* ========================================================
   * LOCAL STOCKS
   * ======================================================== */

  private async seedLocalStocks(
    prisma: PrismaService,
    rng: RandomGenerator,
    reagents: ReagentRecord[],
    labs: LabRecord[],
    shelfLevels: any[],
    users: any[],
  ): Promise<StockState[]> {
    const labUserIds = new Set(
      users.filter((user) => user.lab_id !== null).map((user) => user.user_id),
    );

    /*
     * Silence unused-warning if strict TS complains.
     */
    void labUserIds;

    const shelfLevelsByCategory = new Map<string, any[]>();

    for (const level of shelfLevels) {
      const category = level.shelves.shelf_category;

      if (!shelfLevelsByCategory.has(category)) {
        shelfLevelsByCategory.set(category, []);
      }

      shelfLevelsByCategory.get(category)!.push(level);
    }

    const localStockData: Array<{
      reagent_id: number;
      location_id: number;
      local_stock_units: number;
    }> = [];

    /*
     * Each reagent receives:
     *   - 1 to 3 laboratory locations
     *   - 1 to 4 shelf-level locations
     */

    for (const reagent of reagents) {
      const risk = reagent.reagent_risk ?? 'BLANCO';

      const labCount = Math.min(
        labs.length,
        risk === 'ROJO' || risk === 'AMARILLO' ? rng.int(1, 2) : rng.int(2, 3),
      );

      const shelfCount = rng.int(1, 4);

      const selectedLabs = pickDistinct(rng, labs, labCount);

      const categoryPool = shelfLevelsByCategory.get(risk) ?? shelfLevels;

      const selectedShelfLevels = pickDistinct(
        rng,
        categoryPool,
        Math.min(shelfCount, categoryPool.length),
      );

      for (const lab of selectedLabs) {
        localStockData.push({
          reagent_id: reagent.reagent_id,

          location_id: lab.lab_id,

          local_stock_units: 0,
        });
      }

      for (const level of selectedShelfLevels) {
        localStockData.push({
          reagent_id: reagent.reagent_id,

          location_id: level.shelf_level_id,

          local_stock_units: 0,
        });
      }
    }

    /*
     * Remove accidental duplicate pairs just in case.
     */

    const unique = new Map<
      string,
      {
        reagent_id: number;
        location_id: number;
        local_stock_units: number;
      }
    >();

    for (const row of localStockData) {
      unique.set(`${row.reagent_id}:${row.location_id}`, row);
    }

    const uniqueRows = [...unique.values()];

    for (const batch of chunks(uniqueRows, BATCH_SIZE)) {
      await prisma.local_stocks.createMany({
        data: batch,
      });
    }

    const localStocks = await prisma.local_stocks.findMany({
      orderBy: {
        local_stock_id: 'asc',
      },
    });

    const labIds = new Set(labs.map((lab) => lab.lab_id));

    const shelfLevelByLocationId = new Map<number, any>();

    for (const level of shelfLevels) {
      shelfLevelByLocationId.set(level.shelf_level_id, level);
    }

    const reagentById = new Map(
      reagents.map((reagent) => [reagent.reagent_id, reagent]),
    );

    return localStocks.map((stock) => {
      const reagent = reagentById.get(stock.reagent_id)!;

      const isLab = labIds.has(stock.location_id);

      const shelfLevel = shelfLevelByLocationId.get(stock.location_id);

      return {
        local_stock_id: stock.local_stock_id,

        reagent_id: stock.reagent_id,

        location_id: stock.location_id,

        kind: isLab ? 'LAB' : 'SHELF_LVL',

        risk: reagent.reagent_risk ?? 'BLANCO',

        lab_id: isLab ? stock.location_id : null,

        units: 0,
      };
    });
  }

  /* ========================================================
   * INITIAL INVENTORY
   * ======================================================== */

  private async seedInitialInventory(
    prisma: PrismaService,
    rng: RandomGenerator,
    stocks: StockState[],
    users: any[],
  ): Promise<void> {
    const operators = users.filter((user) => user.lab_id === null);

    if (operators.length === 0) {
      throw new Error(
        'No existen usuarios de almacén para registrar restocks.',
      );
    }

    const initialRestocks = stocks.map((stock) => {
      let units: number;

      if (stock.risk === 'ROJO' || stock.risk === 'AMARILLO') {
        units = rng.int(5, 25);
      } else {
        units = rng.int(10, 50);
      }

      stock.units = units;

      return {
        reagent_id: stock.reagent_id,

        user_id: rng.pick(operators).user_id,

        local_stock_id: stock.local_stock_id,

        restock_units: units,

        restock_date: dateOnly(SIMULATION_START),
      };
    });

    for (const batch of chunks(initialRestocks, BATCH_SIZE)) {
      await prisma.restocks.createMany({
        data: batch,
      });
    }
  }

  /* ========================================================
   * HISTORY SIMULATION
   * ======================================================== */

  private async simulateHistory(
    prisma: PrismaService,
    rng: RandomGenerator,
    reagents: ReagentRecord[],
    stocks: StockState[],
    users: any[],
  ): Promise<void> {
    const warehouseUsers = users.filter((user) => user.lab_id === null);

    const labUsers = users.filter((user) => user.lab_id !== null);

    if (warehouseUsers.length === 0 || labUsers.length === 0) {
      throw new Error('No hay suficientes usuarios para simular operaciones.');
    }

    const stocksByReagent = new Map<number, StockState[]>();

    const stocksByLab = new Map<number, StockState[]>();

    const shelfStocks = stocks.filter((stock) => stock.kind === 'SHELF_LVL');

    for (const stock of stocks) {
      if (!stocksByReagent.has(stock.reagent_id)) {
        stocksByReagent.set(stock.reagent_id, []);
      }

      stocksByReagent.get(stock.reagent_id)!.push(stock);

      if (stock.lab_id !== null) {
        if (!stocksByLab.has(stock.lab_id)) {
          stocksByLab.set(stock.lab_id, []);
        }

        stocksByLab.get(stock.lab_id)!.push(stock);
      }
    }

    const transferableReagentIds = reagents
      .filter((reagent) => {
        const reagentStocks = stocksByReagent.get(reagent.reagent_id) ?? [];

        const hasLab = reagentStocks.some((stock) => stock.kind === 'LAB');

        const hasShelf = reagentStocks.some(
          (stock) => stock.kind === 'SHELF_LVL',
        );

        return hasLab && hasShelf;
      })
      .map((reagent) => reagent.reagent_id);

    const labIds = [...stocksByLab.keys()];

    /*
     * Build the complete event timeline first.
     * Sorting by date gives us a genuine chronological
     * simulation instead of independently generated tables.
     */

    const events: EventShell[] = [];

    let sequence = 0;

    for (let i = 0; i < config.historicalRestocks; i++) {
      events.push({
        type: 'RESTOCK',
        date: randomOperationalDate(rng, SIMULATION_START, SIMULATION_END),
        sequence: sequence++,
      });
    }

    for (let i = 0; i < config.requests; i++) {
      events.push({
        type: 'REQUEST',
        date: randomOperationalDate(rng, SIMULATION_START, SIMULATION_END),
        sequence: sequence++,
      });
    }

    for (let i = 0; i < config.transfers; i++) {
      events.push({
        type: 'TRANSFER',
        date: randomOperationalDate(rng, SIMULATION_START, SIMULATION_END),
        sequence: sequence++,
      });
    }

    const eventPriority: Record<EventType, number> = {
      RESTOCK: 0,
      TRANSFER: 1,
      REQUEST: 2,
    };

    events.sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() ||
        eventPriority[a.type] - eventPriority[b.type] ||
        a.sequence - b.sequence,
    );

    /*
     * Activity ranking.
     * A subset of reagents deliberately receives more demand,
     * creating Pareto-like behavior for Power BI.
     */

    const activityScore = new Map<number, number>();

    for (const reagent of reagents) {
      const value =
        ((reagent.reagent_id * 1664525 + 1013904223) >>> 0) / 4294967296;

      activityScore.set(reagent.reagent_id, 0.25 + value * value * 4);
    }

    const topReagentIds = [...reagents]
      .sort(
        (a, b) =>
          activityScore.get(b.reagent_id)! - activityScore.get(a.reagent_id)!,
      )
      .slice(0, Math.max(10, Math.floor(reagents.length * 0.2)))
      .map((reagent) => reagent.reagent_id);

    let pendingRestocks: any[] = [];
    let pendingRequests: any[] = [];
    let pendingRequestDetails: any[] = [];
    let pendingTransfers: any[] = [];

    let nextRequestId =
      ((
        await prisma.requests.aggregate({
          _max: {
            request_id: true,
          },
        })
      )._max.request_id ?? 0) + 1;

    let generatedRequests = 0;
    let generatedRestocks = 0;
    let generatedTransfers = 0;

    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
      const event = events[eventIndex]!;

      /*
       * -----------------------------
       * RESTOCK
       * -----------------------------
       */

      if (event.type === 'RESTOCK') {
        const reagentId = rng.chance(0.7)
          ? rng.pick(topReagentIds)
          : rng.pick(reagents).reagent_id;

        const reagentStocks = stocksByReagent.get(reagentId) ?? [];

        const shelfCandidates = reagentStocks.filter(
          (stock) => stock.kind === 'SHELF_LVL',
        );

        const candidatePool = rng.chance(0.85)
          ? shelfCandidates
          : reagentStocks;

        if (candidatePool.length === 0) {
          continue;
        }

        const stock = rng.pick(candidatePool);

        const units = this.randomRestockQuantity(rng);

        stock.units += units;

        pendingRestocks.push({
          reagent_id: stock.reagent_id,

          user_id: rng.pick(warehouseUsers).user_id,

          local_stock_id: stock.local_stock_id,

          restock_units: units,

          restock_date: dateOnly(event.date),
        });

        generatedRestocks++;
      }

      /*
       * -----------------------------
       * TRANSFER
       * -----------------------------
       */

      if (event.type === 'TRANSFER') {
        if (transferableReagentIds.length === 0) {
          continue;
        }

        const reagentId = rng.pick(transferableReagentIds);

        const reagentStocks = stocksByReagent.get(reagentId)!;

        const positiveStocks = reagentStocks.filter((stock) => stock.units > 0);

        if (positiveStocks.length < 2) {
          continue;
        }

        let direction: TransferDirection;

        const roll = rng.next();

        if (roll < 0.65) {
          direction = 'SHELF_TO_LAB';
        } else if (roll < 0.85) {
          direction = 'LAB_TO_LAB';
        } else {
          direction = 'SHELF_TO_SHELF';
        }

        let originPool: StockState[] = [];
        let destinationPool: StockState[] = [];

        if (direction === 'SHELF_TO_LAB') {
          originPool = positiveStocks.filter(
            (stock) => stock.kind === 'SHELF_LVL',
          );

          destinationPool = reagentStocks.filter(
            (stock) => stock.kind === 'LAB',
          );
        }

        if (direction === 'LAB_TO_LAB') {
          originPool = positiveStocks.filter((stock) => stock.kind === 'LAB');

          destinationPool = reagentStocks.filter(
            (stock) => stock.kind === 'LAB',
          );
        }

        if (direction === 'SHELF_TO_SHELF') {
          originPool = positiveStocks.filter(
            (stock) => stock.kind === 'SHELF_LVL',
          );

          destinationPool = reagentStocks.filter(
            (stock) => stock.kind === 'SHELF_LVL',
          );
        }

        if (originPool.length === 0 || destinationPool.length === 0) {
          originPool = positiveStocks;

          destinationPool = reagentStocks;
        }

        const origin = rng.pick(originPool);

        const destinations = destinationPool.filter(
          (destination) => destination.location_id !== origin.location_id,
        );

        if (destinations.length === 0) {
          continue;
        }

        const destination = rng.pick(destinations);

        const units = Math.min(this.randomTransferQuantity(rng), origin.units);

        if (units <= 0) {
          continue;
        }

        origin.units -= units;
        destination.units += units;

        const transferDate = randomDateTime(rng, event.date);

        const userId = rng.pick(warehouseUsers).user_id;

        pendingTransfers.push(
          {
            reagent_id: reagentId,

            user_id: userId,

            local_stock_id: origin.local_stock_id,

            transfer_type: 'OUT',

            stock_difference: units,

            transfer_date: transferDate,
          },
          {
            reagent_id: reagentId,

            user_id: userId,

            local_stock_id: destination.local_stock_id,

            transfer_type: 'IN',

            stock_difference: units,

            transfer_date: transferDate,
          },
        );

        generatedTransfers++;
      }

      /*
       * -----------------------------
       * REQUEST
       * -----------------------------
       */

      if (event.type === 'REQUEST') {
        let requestCreated = false;

        /*
         * Try several labs before giving up.
         * This keeps request generation robust even when
         * some laboratories temporarily reach zero stock.
         */

        for (let attempt = 0; attempt < 15; attempt++) {
          const labId = rng.pick(labIds);

          const labStocks = stocksByLab.get(labId) ?? [];

          const availableStocks = labStocks.filter((stock) => stock.units > 0);

          if (availableStocks.length === 0) {
            continue;
          }

          const detailCount = Math.min(
            availableStocks.length,
            this.randomRequestDetailCount(rng),
          );

          const candidates = pickDistinct(rng, availableStocks, detailCount);

          const selectedUser = rng.pick(
            labUsers.filter((user) => user.lab_id === labId),
          );

          const requestId = nextRequestId++;

          pendingRequests.push({
            request_id: requestId,

            user_id: selectedUser.user_id,

            request_date: dateOnly(event.date),
          });

          for (const stock of candidates) {
            const desired = this.randomRequestQuantity(rng);

            const requested = Math.min(desired, stock.units);

            if (requested <= 0) {
              continue;
            }

            stock.units -= requested;

            pendingRequestDetails.push({
              request_id: requestId,

              local_stock_id: stock.local_stock_id,

              requested_units: requested,
            });
          }

          /*
           * Remove the request if for some reason
           * none of the selected details were valid.
           */

          const detailsForRequest = pendingRequestDetails.filter(
            (detail) => detail.request_id === requestId,
          );

          if (detailsForRequest.length === 0) {
            pendingRequests.pop();
            nextRequestId--;
            continue;
          }

          generatedRequests++;
          requestCreated = true;
          break;
        }

        if (!requestCreated) {
          continue;
        }
      }

      /*
       * Flush periodically.
       */

      if (
        pendingRestocks.length >= BATCH_SIZE ||
        pendingRequests.length >= BATCH_SIZE ||
        pendingTransfers.length >= BATCH_SIZE
      ) {
        await this.flushHistoryBatch(
          prisma,
          pendingRestocks,
          pendingRequests,
          pendingRequestDetails,
          pendingTransfers,
        );

        pendingRestocks = [];
        pendingRequests = [];
        pendingRequestDetails = [];
        pendingTransfers = [];

        if (eventIndex % 20_000 === 0) {
          console.log(
            `      ${eventIndex}/${events.length} eventos procesados...`,
          );
        }
      }
    }

    /*
     * Final batch.
     */

    await this.flushHistoryBatch(
      prisma,
      pendingRestocks,
      pendingRequests,
      pendingRequestDetails,
      pendingTransfers,
    );

    console.log(`      Restocks: ${generatedRestocks}`);

    console.log(`      Requests: ${generatedRequests}`);

    console.log(`      Transferencias: ${generatedTransfers}`);

    console.log(`      Filas transfer: ${generatedTransfers * 2}`);
  }

  /* ========================================================
   * BATCH INSERT
   * ======================================================== */

  private async flushHistoryBatch(
    prisma: PrismaService,
    restocks: any[],
    requests: any[],
    requestDetails: any[],
    transfers: any[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      if (requests.length > 0) {
        await tx.requests.createMany({
          data: requests,
        });
      }

      if (requestDetails.length > 0) {
        await tx.request_details.createMany({
          data: requestDetails,
        });
      }

      if (restocks.length > 0) {
        await tx.restocks.createMany({
          data: restocks,
        });
      }

      if (transfers.length > 0) {
        await tx.transfer.createMany({
          data: transfers,
        });
      }
    });
  }

  /* ========================================================
   * QUANTITY DISTRIBUTIONS
   * ======================================================== */

  private randomRestockQuantity(rng: RandomGenerator): number {
    const roll = rng.next();

    if (roll < 0.6) {
      return rng.int(1, 5);
    }

    if (roll < 0.9) {
      return rng.int(6, 20);
    }

    return rng.int(21, 50);
  }

  private randomRequestQuantity(rng: RandomGenerator): number {
    const roll = rng.next();

    if (roll < 0.7) {
      return rng.int(1, 3);
    }

    if (roll < 0.95) {
      return rng.int(4, 8);
    }

    return rng.int(9, 15);
  }

  private randomTransferQuantity(rng: RandomGenerator): number {
    const roll = rng.next();

    if (roll < 0.7) {
      return rng.int(1, 5);
    }

    if (roll < 0.95) {
      return rng.int(6, 15);
    }

    return rng.int(16, 30);
  }

  private randomRequestDetailCount(rng: RandomGenerator): number {
    const roll = rng.next();

    if (roll < 0.6) {
      return 1;
    }

    if (roll < 0.9) {
      return 2;
    }

    return 3;
  }

  /* ========================================================
   * FINAL STOCK UPDATE
   * ======================================================== */

  private async updateFinalStocks(
    prisma: PrismaService,
    stocks: StockState[],
  ): Promise<void> {
    console.log('      Actualizando local_stock_units finales...');

    const BATCH_SIZE = 500;

    for (const batch of chunks(stocks, BATCH_SIZE)) {
      const cases = batch
        .map((stock) => `WHEN ${stock.local_stock_id} THEN ${stock.units}`)
        .join('\n');

      const ids = batch.map((stock) => stock.local_stock_id).join(', ');

      const sql = `
            UPDATE local_stocks
            SET local_stock_units =
                CASE local_stock_id
                    ${cases}
                END
            WHERE local_stock_id IN (${ids});
        `;

      await prisma.$executeRawUnsafe(sql);
    }
  }

  /* ========================================================
   * VALIDATION
   * ======================================================== */

  private async validateResult(prisma: PrismaService): Promise<void> {
    const negativeStocks = await prisma.local_stocks.count({
      where: {
        local_stock_units: {
          lt: 0,
        },
      },
    });

    if (negativeStocks > 0) {
      throw new Error(
        `Existen ${negativeStocks} local_stocks con inventario negativo.`,
      );
    }

    const totalStock =
      (
        await prisma.local_stocks.aggregate({
          _sum: {
            local_stock_units: true,
          },
        })
      )._sum.local_stock_units ?? 0;

    const totalRestocked =
      (
        await prisma.restocks.aggregate({
          _sum: {
            restock_units: true,
          },
        })
      )._sum.restock_units ?? 0;

    const totalRequested =
      (
        await prisma.request_details.aggregate({
          _sum: {
            requested_units: true,
          },
        })
      )._sum.requested_units ?? 0;

    const transferIn =
      (
        await prisma.transfer.aggregate({
          where: {
            transfer_type: 'IN',
          },
          _sum: {
            stock_difference: true,
          },
        })
      )._sum.stock_difference ?? 0;

    const transferOut =
      (
        await prisma.transfer.aggregate({
          where: {
            transfer_type: 'OUT',
          },
          _sum: {
            stock_difference: true,
          },
        })
      )._sum.stock_difference ?? 0;

    if (transferIn !== transferOut) {
      throw new Error(
        `Las transferencias no cuadran: IN=${transferIn}, OUT=${transferOut}`,
      );
    }

    const expectedGlobalStock = totalRestocked - totalRequested;

    if (totalStock !== expectedGlobalStock) {
      throw new Error(
        [
          'El inventario global no cuadra.',
          `Actual: ${totalStock}`,
          `Esperado: ${expectedGlobalStock}`,
          `Restocks: ${totalRestocked}`,
          `Requests: ${totalRequested}`,
        ].join('\n'),
      );
    }

    console.log(`      Stock global: ${totalStock}`);

    console.log(`      Restock global: ${totalRestocked}`);

    console.log(`      Consumo global: ${totalRequested}`);

    console.log(`      Transfer IN: ${transferIn}`);

    console.log(`      Transfer OUT: ${transferOut}`);

    console.log('      ✓ Inventario global consistente.');
  }
}
