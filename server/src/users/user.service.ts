import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../_prisma_nestjs/prisma.service.js';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import { Prisma } from '../_prisma_generated/client.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(
    target_user_id: number,
    data: {
      user_data: {
        user_first_name: string;
        user_last_name: string;
        user_middle_name?: string;
        user_phone_number: string;
        user_username: string;
        user_password?: string;
      };
      lab_data: {
        lab_id: number;
      };
    },
    source_user_data: {
      userId: string;
      username: string;
    },
  ) {
    const update = await this.prisma.users.update({
      where: {
        user_id: Number(target_user_id),
      },
      data: {
        user_first_name: data.user_data.user_first_name,
        user_last_name: data.user_data.user_last_name,
        ...(data.user_data.user_middle_name !== undefined && {
          user_middle_name: data.user_data.user_middle_name,
        }),
        user_phone_number: data.user_data.user_phone_number,
        user_username: data.user_data.user_username,
        ...(data.user_data.user_password !== undefined && {
          user_password: await bcrypt.hash(data.user_data.user_password, 10),
        }),
        labs: {
          connect: {
            lab_id: Number(data.lab_data.lab_id),
          },
        },
      },
    });

    return update ?? new HttpException('UPDATE_ERROR', HttpStatus.BAD_REQUEST);
  }

  async getUsersByStatus(status: number) {
    const users = await this.prisma.users.findMany({
      where: { user_status: status },
      select: {
        user_id: true,
        user_first_name: true,
        user_middle_name: true,
        user_last_name: true,
        user_phone_number: true,
        user_username: true,
        labs: {
          select: {
            lab_name: true,
          },
        },
      },
    });

    return users ?? [];
  }

  async getActiveRegular() {
    const users = await this.prisma.users.findMany({
      where: { role_id: 2 },
      select: {
        user_id: true,
        user_first_name: true,
        user_middle_name: true,
        user_last_name: true,
        user_phone_number: true,
        user_username: true,
        labs: {
          select: {
            lab_id: true,
            lab_name: true,
          },
        },
      },
    });

    return users ?? [];
  }

  async getAssignedLab(user_id: number, tx?: Prisma.TransactionClient) {
    const client = tx ? tx : this.prisma;
    const lab_id = await client.users.findUnique({
      where: { user_id: user_id },
      select: { lab_id: true },
    });

    if (!lab_id)
      throw new HttpException('ERR_UNASSIG_LAB', HttpStatus.NOT_FOUND);

    const lab = await client.labs.findUnique({
      where: { lab_id: lab_id!.lab_id! },
    });

    if (!lab)
      throw new HttpException('ERR_LAB_NOT_FOUND', HttpStatus.NOT_FOUND);

    return lab;
  }

  async userExists(username: string) {
    const user = await this.prisma.users.findFirst({
      where: { user_username: username },
    });
    return user ? 1 : 0;
  }

  async userStatus(username: string) {
    const status = await this.prisma.users.findUnique({
      where: { user_username: username },
      select: { user_status: true },
    });

    return status!.user_status;
  }

  async getUserByUsn(username: string) {
    return await this.prisma.users.findUniqueOrThrow({
      where: { user_username: username },
      select: {
        user_id: true,
        role_id: true,
        user_first_name: true,
        user_last_name: true,
        user_middle_name: true,
        user_username: true,
        user_password: true,
        user_phone_number: true,
        user_status: true,
        labs: {
          select: {
            host_building: true,
            lab_name: true,
          },
        },
      },
    });
  }

  async getUserByID(user_id: number) {
    return await this.prisma.users.findUniqueOrThrow({
      where: { user_id: user_id },
      select: {
        user_id: true,
        role_id: true,
        user_first_name: true,
        user_last_name: true,
        user_middle_name: true,
        user_username: true,
        user_password: true,
        user_phone_number: true,
        user_status: true,
        labs: {
          select: {
            host_building: true,
            lab_name: true,
          },
        },
      },
    });
  }

  async listAllUsers() {
    return await this.prisma.users.findMany();
  }

  async updateUsername(user_id: number, new_username: string) {
    return await this.prisma.users
      .update({
        data: {
          user_username: new_username,
        },
        where: { user_id: Number(user_id) },
      })
      .catch((error) => console.error(error));
  }

  async updatePassword(userId: number, new_password: string) {
    return await this.prisma.users
      .update({
        data: {
          user_password: await bcrypt.hash(new_password, 10),
        },
        where: { user_id: userId },
      })
      .catch((error) => console.error(error));
  }

  async getRole(userId?: number, username?: string) {
    if (userId == undefined && username == undefined)
      throw new TypeError(
        'ARGUMENTOS INSUFICIENTES PARA LA BÚSQUEDA DE ROLES.',
      );

    const roleId = this.prisma.users.findUnique({
      where:
        username != undefined
          ? { user_username: username }
          : { user_id: userId },
      select: { role_id: true },
    });

    if (!roleId)
      throw new HttpException('ERR_UNASSIGNED_ROLE', HttpStatus.BAD_REQUEST);

    return roleId;
  }

  async getPermissions(userId?: number, username?: string): Promise<string[]> {
    if (userId == undefined && username == undefined)
      throw new TypeError(
        'ARGUMENTOS INSUFICIENTES PARA LA BÚSQUEDA DE ROLES.',
      );

    const role = await this.getRole(userId);
    const permissions = await this.prisma.roles_permissions.findMany({
      where: { role_id: role!.role_id },
      select: { permission_id: true },
    });

    let result: string[] = [];

    for (const permission of permissions) {
      const id = permission.permission_id;
      const nameQuery: { permission_name: string } | null =
        await this.prisma.permissions.findUnique({
          where: { permission_id: id },
          select: { permission_name: true },
        });
      result.push(nameQuery!.permission_name!);
    }

    return result;
  }

  async newUser(registrationFields: {
    labName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    username: string;
    password: string;
  }) {
    const {
      labName,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      username,
      password,
    } = registrationFields;
    const lab: { lab_id: number } | null = await this.prisma.labs.findUnique({
      where: { lab_name: labName },
      select: { lab_id: true },
    });

    if (lab == null) throw new TypeError('ERR_LAB_NOT_FOUND');

    const securedPassword = await bcrypt.hash(password, 10);

    const createdUser = this.prisma.users.create({
      data: {
        lab_id: lab.lab_id,
        role_id: 2,
        user_first_name: firstName,
        user_middle_name: middleName,
        user_last_name: lastName,
        user_phone_number: phoneNumber,
        user_username: username,
        user_password: securedPassword,
      },
    });
    return createdUser;
  }

  async deleteUser(deletion_request: {
    request_source_id: number;
    request_target_id: number;
  }) {
    const request_source = await this.prisma.users.findUnique({
      where: { user_id: deletion_request.request_source_id },
    });

    const permissions = await this.getPermissions(request_source?.user_id);

    let allow_operation: boolean =
      deletion_request.request_source_id == deletion_request.request_target_id
        ? permissions.includes('permissions.users.modify_self')
        : permissions.includes('permissions.users.modify_others');

    const request_target =
      deletion_request.request_source_id == deletion_request.request_target_id
        ? request_source
        : await this.prisma.users.findUnique({
            where: { user_id: deletion_request.request_target_id },
          });

    if (!request_target)
      throw new HttpException('ERR_USER_NOT_FOUND.', HttpStatus.NOT_FOUND);

    if (allow_operation) {
      if (request_target.role_id == 1) {
        const adminAvailable = await this.prisma.users.count({
          where: { role_id: 1 },
        });

        if (adminAvailable == 1) {
          console.log(
            chalk.red(
              '< SISTEMA >: NO PUEDE SE PUEDE PROCEDER CON LA OPERACIÓN.',
            ),
          );
          console.log(
            chalk.red(
              '< SISTEMA >: MOTIVO: DEBE EXISTIR AL MENOS UN ADMINISTRADOR PARA EL MANEJO DEL SISTEMA.',
            ),
          );
          throw new HttpException(
            'ERR_RISKY_OPERATION_DETECTED',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      const deletedUser = await this.prisma.users.update({
        data: { user_status: 2 },
        where: { user_id: request_target.user_id },
      });

      return 'EL USUARIO ' + deletedUser.user_username + 'HA SIDO DESCARTADO.';
    } else throw new HttpException('ERR_UNAUTHORIZED', HttpStatus.FORBIDDEN);
  }

  async approveUser(approval_request: {
    request_source_id: number;
    request_target_id: number;
  }) {
    const request_source = await this.getUserByID(
      Number(approval_request.request_source_id),
    );
    const permissions = await this.getPermissions(request_source?.user_id);

    let allow_operation: boolean = permissions.includes(
      'permissions.users.approve_new_signups',
    );

    const request_target = await this.getUserByID(
      Number(approval_request.request_target_id),
    );

    if (!request_target)
      throw new HttpException('ERR_USER_NOT_FOUND.', HttpStatus.NOT_FOUND);

    if (allow_operation) {
      const approvedUser = await this.prisma.users.update({
        data: { user_status: 1 },
        where: { user_id: request_target.user_id },
      });

      return 'EL USUARIO ' + approvedUser.user_username + 'HA SIDO APROBADO.';
    } else throw new HttpException('ERR_FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  async editUser(
    userPayload: { userId: number; username: string },
    body: { username: string; fields: { user_password?: string } },
  ) {
    const { userId, username } = userPayload;
    const { username: targetUsername, fields } = body;

    const permissions: string[] = await this.getPermissions(userId);
    let forbidden_fields: string[] = ['user_id', 'lab_id'];

    let allow_operation: boolean;
    allow_operation =
      username == targetUsername
        ? permissions.includes('permissions.users.modify_self')
        : permissions.includes('permissions.users.modify_others');

    if (allow_operation) {
      const role = await this.getRole(userId);
      if (role!.role_id == 2)
        forbidden_fields.concat(['user_status', 'role_id']);

      const invalidFields = Object.keys(fields).filter((field) =>
        forbidden_fields.includes(field),
      );

      if (invalidFields.length > 0) {
        invalidFields.forEach((invalidField) => {
          console.log('ERR_FORBIDDEN_UPDATE_DETECTED: ' + invalidField);
        });
        throw new HttpException(
          'ERR_FORBIDDEN_UPDATE_DETECTED',
          HttpStatus.FORBIDDEN,
        );
      }

      if (Object.keys(fields).includes('user_password'))
        fields.user_password = await bcrypt.hash(fields.user_password, 10);

      const modifiedUser = this.prisma.users.update({
        where: { user_username: targetUsername },
        data: fields,
      });

      return modifiedUser;
    } else throw new HttpException('ERR_UNAUTHORIZED', HttpStatus.FORBIDDEN);
  }
}
