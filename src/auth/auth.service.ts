import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.validate(username, password);
        if (user) {
            const result = {
                id: user.id,
                username: user.username,
            };
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { id: user.id, username: user.username };
        const token = this.jwtService.sign(payload, {
            expiresIn: '1h',
        });
        /*
           Here, I was given the option to not return the token,
           but it is optional if I want to change the authentication
           to a token instead of a cookie stored in session storage.
           The front-end is integrated in this way.
           See user/user.controller.ts for more details.
        */
        return {
            token: token,
        };
    }
}
