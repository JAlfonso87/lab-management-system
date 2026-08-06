import { SetMetadata } from "@nestjs/common";

export const RolePermissions = (permissions:String[]) => SetMetadata('PERMISSIONS', permissions)