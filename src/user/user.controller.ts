import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    Request,
    Get,
    Delete,
    Param,
    Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/auth/local.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const registerResult = await this.userService.create(createUserDto);
        if (registerResult) {
            return {
                message: 'User has been created successfully',
                success: true,
            };
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error 500: Internal Server Error',
            success: false,
            user: {},
        });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const login_token = await this.authService.login(req.user);
        if (login_token) {
            res.cookie('auth-cookie', login_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            return {
                message: 'User logged in successfully',
                success: true,
                code: HttpStatus.OK,
            };
            // Note: The login method receives the token from the AuthService.
            // It sets the token as an HttpOnly cookie (auth-cookie) in the response using res.cookie.
            // So, while the AuthService generates the token, the UserController is responsible for
            // setting this token as a cookie in the client browser and storing in session storage.
            // The token is not returned directly in the response body.
            // The frontend should handle the cookie for authentication.
            // And it is not yet necessary to insert a return for 401 and the local guard already does that.
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@AuthUser() user: UserEntity) {
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async delete(@Param('id') id: number, @Res() res: Response) {
        const deleteResult = await this.userService.deleteUser(id);
        if (deleteResult) {
            return res.status(HttpStatus.OK).json({
                message: 'User has been deleted successfully',
                success: true,
            });
        }
        return res.status(HttpStatus.NOT_FOUND).json({
            message: 'User not found',
            success: false,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/detail/:id')
    async findUserById(
        @Param('id') id: number,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.userService.findUserById(id);
        if (user) {
            return {
                user,
            };
        } else {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'User not found',
                success: false,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('/update/:id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDTO,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            const user = await this.userService.update(id, updateUserDto);
            if (user) {
                return {
                    user,
                };
            }
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'User not found',
                success: false,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred',
                success: false,
                error: error,
            });
        }
    }
}
