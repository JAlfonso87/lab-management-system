import { SetMetadata } from '@nestjs/common';

export const Authorized_Roles = (roles: String[]) =>
  SetMetadata('AUTHORIZED_ROLES', roles);
