import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'
import { UserType } from '@prisma/client';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}
interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(
    { email, password, name, phone }: SignupParams,
    userType: UserType,
  ) {
    const userExist = await this.prismaService.user.findUnique({
      where: { 
        email, 
      },
    }); 

    if (userExist) {
      throw new ConflictException(); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        userType: userType,
      },
    });

    return this.generateJWT(name, user.id)

  }



  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where:{
        email,
      },
    });

    if (!user) {
      throw new HttpException('invalid credentials', 400);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('invalid credentials', 400)
    }
    return this.generateJWT(user.name, user.id);

  };

  private  generateJWT(name: string, id: number) {
    return jwt.sign({
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,{
        expiresIn: '30d'
      }, 
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
} 
 