import { UserType } from '@prisma/client';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { UserInfo } from '../decorators/user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: SignupDto, userType: UserType): Promise<string>;
    signin(body: SigninDto): Promise<string>;
    generateProductKey({ userType, email }: GenerateProductKeyDto): Promise<string>;
    me(user: UserInfo): UserInfo;
}
