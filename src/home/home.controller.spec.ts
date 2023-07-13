import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 53,
  name: 'omar',
  email: 'omar45@hotmail.com',
  phone: '555 555 5555',
};
const mockHome = [
  {
    id: 1,
    address: '234 omar str',
    city: 'Alexandria',
    price: 150000,
    property_Type: PropertType.RESIDENTIAL,
    image: 'img1',
    number_of_bedrooms: 3,
    number_of_bathrooms: 2,
    images: [
      {
        id: 1,
        url: 'src1 ',
      },
    ],
  },
];

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Alexandria', '150000');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Alexandria',
        price: {
          gte: 150000,
        },
      });
    });
  });
  describe('updateHome', () => {
    const mockUserInfo = {
      name: 'omar',
      id: 30,
      iat: 1,
      exp: 2,
    };
    // const mockCreateHomeParams = {
    //   address: '234 omar str',
    //   numberOfBedrooms: 3,
    //   numberOfBathrooms: 2,
    //   city: 'Alexandria',
    //   landSize: 2000,
    //   price: 3000000,
    //   propertyType: PropertType.RESIDENTIAL,
    // };
    const mockUpdateHomeParams = {
      address: '234 omar str',
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      city: 'Alexandria',
      landSize: 2000,
      price: 3000000,
      propertyType: PropertType.RESIDENTIAL,
    };
    it("should throw Unauth error if realtor didn't create home", async () => {
      await expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });
    it('should update home if realtor is valid', async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome);
      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockUpdateHome);
      await controller.updateHome(5, mockUpdateHomeParams, {
        ...mockUserInfo,
        id: 53,
      });
       expect(mockUpdateHome).toBeCalled();
    });
  });
});
