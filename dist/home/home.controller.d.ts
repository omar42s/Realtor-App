import { HomeService } from './home.service';
import { HomeResponseDto, CreateHomeDto, UpdateHomeDto, InquireDto } from './dto/home.dto';
import { PropertType } from '@prisma/client';
import { UserInfo } from 'src/user/decorators/user.decorator';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    getHomes(city?: string, minPrice?: string, maxPrice?: string, propertyType?: PropertType): Promise<HomeResponseDto[]>;
    getHome(id: number): Promise<HomeResponseDto>;
    createHome(body: CreateHomeDto, user: UserInfo): Promise<HomeResponseDto>;
    updateHome(id: number, body: UpdateHomeDto, user: UserInfo): Promise<HomeResponseDto>;
    deleteHome(id: number, user: UserInfo): Promise<void>;
    inquire(homeId: number, user: UserInfo, { message }: InquireDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        message: string;
        home_id: number;
        realtor_id: number;
        buyer_id: number;
    }, unknown> & {}>;
    getHomeMessage(id: number, user: UserInfo): Promise<{
        message: string;
        buyer: {
            name: string;
            phone: string;
            email: string;
        };
    }[]>;
}
