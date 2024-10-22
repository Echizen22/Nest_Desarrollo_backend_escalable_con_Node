import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User
  ) {

    // console.log({ user: request.user });

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user
    }
  }

}
