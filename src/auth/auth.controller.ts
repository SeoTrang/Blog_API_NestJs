import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { promises } from 'dns';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto):Promise<User> {
        console.log("register api");
        console.log(registerUserDto);
        return await this.authService.register(registerUserDto);
    }


    @Post('login')
    @ApiResponse({
        status: 200,
        description: 'Login successfully',
        content: {
            'application/json': {
                example: {
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                }
            }
        }
    })
    @ApiResponse({status: 401, description: 'UnAuthorized'})
    @UsePipes(ValidationPipe)
    async login(@Body() loginUserDto: LoginUserDto): Promise<any>{
        console.log("login api");
        
        return await this.authService.login(loginUserDto);
    }

    @Post('refresh-token')
    async refreshToken(@Body() {refresh_token}): Promise<any> {
        // console.log(refresh_token);
        return await this.authService.refreshToken(refresh_token);
        
    }
}
