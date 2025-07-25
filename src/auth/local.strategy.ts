import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(request: Request, username: string, password: string) {
        const user = await this.authService.validateUser(username, password);
        return user;
    }
}
