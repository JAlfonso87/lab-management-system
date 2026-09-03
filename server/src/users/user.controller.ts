import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { PublicRoute } from '../_nestjs_decorators/public.decorator.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Controller('users')
@Authorized_Roles(['ADMIN'])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @Post('signup')
  newUser(@Body() userData: any): Promise<any> {
    return this.userService.newUser(userData);
  }

  @PublicRoute()
  @Get('check')
  userExists(@Query('username') username: string) {
    console.log(username);
    return this.userService.userExists(username);
  }

  @Get('all')
  listAllUsers(): Promise<any> {
    return this.userService.listAllUsers();
  }

  @Authorized_Roles(['USER'])
  @Get('find')
  async getUserData(
    @Query('spec') spec,
    @Query('method') method,
    @Request() req,
    @Body() body: { username: string } | { userId: number },
  ) {
    if (method == 'usn') {
      const { username } = (body ?? { username: '' }) as { username: string };
      const { user_password, role_id, user_status, ...cleanUser } =
        await this.userService.getUserByUsn(
          spec == 'current' ? req.user.username : username,
        );
      return cleanUser;
    }
    if (method == 'id') {
      const { userId } = (body ?? { userId: 0 }) as { userId: number };
      const { user_password, role_id, user_status, ...cleanUser } =
        await this.userService.getUserByID(
          spec == 'current' ? req.user.userId : Number(userId),
        );
      return cleanUser;
    }
  }

  @Get('inactive')
  getInactiveUsers() {
    return this.userService.getUsersByStatus(0);
  }

  @Get('active/nadmin')
  getActiveRegular() {
    return this.userService.getActiveRegular();
  }

  @Post('terminate')
  @Authorized_Roles(['USER'])
  terminateUser(@Query('target') target, @Req() req): Promise<any> {
    return this.userService.deleteUser({
      request_source_id: Number(req.user.userId),
      request_target_id: Number(target),
    });
  }

  @Post('approve')
  approveUserRegistration(@Query('target') target, @Req() req) {
    return this.userService.approveUser({
      request_source_id: Number(req.user.userId),
      request_target_id: Number(target),
    });
  }

  @Post('edit')
  @Authorized_Roles(['USER'])
  editUser(
    @Req() req,
    @Body() body: { username: string; fields: object },
  ): Promise<any> {
    return this.userService.editUser(req.user, body);
  }

  @Post('user/credentials')
  @Authorized_Roles(['USER'])
  editUserCredentials(
    @Query('type') type: string,
    @Request() req,
    @Body() body: { new_username: string } | { new_password: string },
  ) {
    if (type == 'pwd') {
      const { new_password } = body as { new_password: string };
      return this.userService.updatePassword(req.user.userId, new_password);
    }

    if (type == 'usn') {
      const { new_username } = body as { new_username: string };
      return this.userService.updateUsername(req.user.userId, new_username);
    }
  }

  @Post('/user/update')
  updateUserInfo(
    @Query('id') id,
    @Body()
    body: {
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
    @Request() req,
  ) {
    console.log(body);
    return this.userService.updateUser(id, body, req.user);
  }
}
