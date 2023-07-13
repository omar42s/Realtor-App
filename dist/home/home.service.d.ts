import { PrismaService } from '../prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertType } from '@prisma/client';
import { UserInfo } from 'src/user/decorators/user.decorator';
interface GetHomesParam {
    city?: string;
    price?: {
        gte?: number;
        lte?: number;
    };
    PropertyType?: PropertType;
}
interface CreateHomeParams {
    address: string;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    city: string;
    price: number;
    landSize: number;
    propertyType: PropertType;
    images: {
        url: string;
    }[];
}
interface UpdateHomeParams {
    address?: string;
    numberOfBedrooms?: number;
    numberOfBathrooms?: number;
    city?: string;
    price?: number;
    landSize?: number;
    propertyType?: PropertType;
}
export declare const homeSelect: {
    id: boolean;
    address: boolean;
    city: boolean;
    price: boolean;
    propertType: boolean;
    number_of_bathrooms: boolean;
    number_of_bedrooms: boolean;
};
export declare class HomeService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]>;
    getHomeById(id: number): Promise<HomeResponseDto>;
    createHome({ address, numberOfBathrooms, numberOfBedrooms, city, landSize, price, propertyType, images, }: CreateHomeParams, userId: number): Promise<HomeResponseDto>;
    updateHomeById(id: number, data: UpdateHomeParams): Promise<HomeResponseDto>;
    deleteHomeById(id: number): Promise<void>;
    getRealtorByHomeId(id: number): Promise<{
        name: string;
        id: number;
        email: string;
        phone: string;
    }>;
    inquire(buyer: UserInfo, homeId: any, message: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        message: string;
        home_id: number;
        realtor_id: number;
        buyer_id: number;
    }, unknown> & {}>;
    getMessageByHome(homeId: number): import(".prisma/client").Prisma.PrismaPromise<{
        message: string;
        buyer: {
            name: string;
            phone: string;
            email: string;
        };
    }[]>;
}
export {};
