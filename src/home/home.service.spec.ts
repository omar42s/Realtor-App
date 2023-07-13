import { PropertType } from '.prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService, homeSelect } from './home.service';

const mockGetHomes = [
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

const mockHome = {
  id: 1,
  address: '234 omar str',
  city: 'Alexandria',
  price: 150000,
  property_Type: PropertType.RESIDENTIAL,
  image: 'img1',
  number_of_bedrooms: 3,
  number_of_bathrooms: 2,
};

const mockImage = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImage),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 100000,
        lte: 150000,
      },
    };
    it('should call prisma home,findMany with correct params', async () => {
      const mockprismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockprismaFindManyHomes);
      await service.getHomes(filters);
      expect(mockprismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('should throw not found exception if no homes are found ', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createHome', () => {
    it('should call prisma home.create with the correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      const mockCreateHomeParams = {
        address: '234 omar str',
        numberOfBedrooms: 3,
        numberOfBathrooms: 2,
        city: 'Alexandria',
        landSize: 2000,
        price: 3000000,
        propertyType: PropertType.RESIDENTIAL,
        images: [
          {
            url: 'src1',
          },
        ],
      };

      await service.createHome(mockCreateHomeParams, 9);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: '234 omar str',
          number_of_bedrooms: 3,
          number_of_bathrooms: 2,
          city: 'Alexandria',
          land_size: 2000,
          price: 3000000,
          propertType: PropertType.RESIDENTIAL,
          realtor_id: 9,
        },
      });
    });

    it('should call prisma image.createMany with correct payload', async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImage);
      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImage);

      const mockCreateHomeParams = {
        address: '234 omar str',
        numberOfBedrooms: 3,
        numberOfBathrooms: 2,
        city: 'Alexandria',
        landSize: 2000,
        price: 1500000,
        propertyType: PropertType.RESIDENTIAL,
        images: [
          {
            url: 'src1',
          },
        ],
      };

      await service.createHome(mockCreateHomeParams, 9);

      expect(mockCreateManyImage).toBeCalledWith({
        data: [
          {
            url: 'src1',
            home_id: 1,
          },
        ],
      });
    });
  });
});
