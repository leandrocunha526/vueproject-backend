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
        Note: Returning the token here is optional. If the frontend is configured to
        use authentication cookies, the token may be sent as an HttpOnly cookie instead of
        being returned directly. Refer to `user/user.controller.ts` for specifics on the
        implementation and how authentication cookies are being utilized.
        The login method receives the token from the AuthService.
        It sets the token as an HttpOnly cookie (auth-cookie) in the response using res.cookie.
        So, while the AuthService generates the token, the UserController is responsible for
        setting this token as a cookie in the client browser and storing in session storage.
        */
        return {
            token,
        };
    }
}
