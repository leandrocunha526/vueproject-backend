import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        configService: ConfigService,
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const data = request?.cookies['auth-cookie'];
                    if (!data) {
                        return null;
                    }
                    return data.token;
                },
            ]),
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findById(payload.id);
        return user;
    }
}
