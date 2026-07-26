import { SetMetadata } from "@nestjs/common";
//import { Reflector } from "@nestjs/core";

export const Authorized_Roles = (roles:String[]) => SetMetadata('AUTHORIZED_ROLES', roles);