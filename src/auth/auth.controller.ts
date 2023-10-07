import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthdDto, LogindDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    register(@Body() dto: AuthdDto) {
        return this.authService.register(dto);
    }

    @Post("login")
    login(@Body() dto: LogindDto) {
        return this.authService.login(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("me")
    userInfo(@Request() req) {
        const userId = req.user.userId;

        return this.authService.userInfo(userId);
    }
}
