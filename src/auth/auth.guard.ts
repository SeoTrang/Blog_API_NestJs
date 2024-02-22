import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor( 
        private jwtService: JwtService,
        private configService:ConfigService
        ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // throw new Error("Method not implemented.");
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret:this.configService.get<string>('SECRET_KEY')
            })
            request['user_data'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;

    }

    private extractTokenFromHeader(request: Request): string|undefined{
        const [type,token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];
        return type === "Bearer" ? token : undefined;
    }


}