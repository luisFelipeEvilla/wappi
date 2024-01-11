import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn((dto) => {
      return {
        user_id: Math.floor(Math.random() * 100),
        payment_source_id: null,
        ...dto,
      };
    }),

    find: jest.fn(() => [
      {
        user_id: 1,
        email: 'usertest@gmail.com',
        is_driver: true,
        payment_source_id: null,
      },
    ]),

    findOne: jest.fn((id: number) => {
      return {
        user_id: id,
        email: 'usertest@gmail.com',
        is_driver: true,
        payment_source_id: null,
      };
    }),

    update: jest.fn((id: number, dto: UpdateUserDto) => {
      return {
        affected: 1,
      };
    }),

    delete: jest.fn((id: number) => {
      return {
        affected: 1,
      };
    }),

    save: jest.fn((user: User) => {
      return {
        user_id: user.user_id || Math.floor(Math.random() * 100),
        ...user,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create a user', async () => {
    const dto: CreateUserDto = {
      email: 'usertest@gmail.com',
      is_driver: true,
    };

    const user = await service.create(dto);

    expect(user).toBeDefined();

    expect(mockUserRepository.create).toHaveBeenCalledWith(dto);

    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);

    expect(user.user_id).toEqual(expect.any(Number));

    expect(user.email).toEqual(dto.email);
  });

  it('should find all users', async () => {
    const users = await service.findAll();

    expect(users).toEqual([{
      user_id: 1,
      email: 'usertest@gmail.com',
      is_driver: true,
      payment_source_id: null,
    }]);

    expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should find a user by id', async () => {
    const user = await service.findOne(1);

    expect(user).toBeDefined();

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { user_id: 1 },
    });

    expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = {
      email: 'usertest2@gmail.com',
      is_driver: false,
    };

    const user = await service.update(1, dto);

    expect(user).toBeDefined();

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { user_id: 1 },
    });

    expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
      email: 'usertest2@gmail.com',
      is_driver: false,
    });

    expect(user.affected).toEqual(1);
  });

  it('should delete a user', async () => {
    const user = await service.remove(1);

    expect(user).toBeDefined();

    expect(mockUserRepository.delete).toHaveBeenCalledWith(1);

    expect(user.affected).toEqual(1);
  });

  it('should find a driver', async () => {
    const driver = await service.findDriver({
      type: 'Point',
      coordinates: [0, 0],
    });

    expect(driver).toBeDefined();

    expect(driver.is_driver).toEqual(true);
  });
});
