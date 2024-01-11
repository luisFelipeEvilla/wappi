import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto: CreateUserDto) => {
      return {
        user_id: Math.floor(Math.random() * 100),
        payment_source_id: null,
        ...dto
      };
    },
    ),

    findAll: jest.fn(() => []),

    findOne: jest.fn((id: number) => {
      return {
        user_id: id,
        email: 'usertest@gmail.com',
        is_driver: true,
        payment_source_id: null
      };
    }
    ),

    update: jest.fn((id: number, dto: CreateUserDto) => {
      return {
        user_id: id,
        payment_source_id: null,
        ...dto
      };
    }
    ),

    remove: jest.fn((id: number) => {
      return {
        user_id: id,
        email: 'usertest@gmail.com',
        is_driver: true,
        payment_source_id: null
      }
    }
    )
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    expect(controller.create).toBeDefined();

    const mockUser: CreateUserDto  = {
      email: 'usertest@gmail.com',
      is_driver: true
    };

    expect(controller.create(mockUser)).toEqual({
      user_id: expect.any(Number),
      email: 'usertest@gmail.com',
      is_driver: true,
      payment_source_id: null
    });

    expect(mockUserService.create).toHaveBeenCalled();

    expect(mockUserService.create).toHaveBeenCalledWith(mockUser);
  })

  it('should get all users', () => {
    expect(controller.findAll).toBeDefined();

    expect(controller.findAll()).toEqual([]);
  });

  it('should get a user by id', () => {
    expect(controller.findOne).toBeDefined();

    expect(controller.findOne(1)).toEqual({
      user_id: 1,
      email: 'usertest@gmail.com',
      is_driver: true,
      payment_source_id: null
    });
    
    expect(mockUserService.findOne).toHaveBeenCalled();
    expect(mockUserService.findOne).toHaveBeenCalledWith(1);
  });


  it('should update a user', () => {
    expect(controller.update).toBeDefined();

    const mockUser: UpdateUserDto = {
      email: 'usertest2@gmail.com',
      is_driver: false
    };

    expect(controller.update(1, mockUser)).toEqual({
      user_id: 1,
      email: 'usertest2@gmail.com',
      is_driver: false,
      payment_source_id: null
    });

    expect(mockUserService.update).toHaveBeenCalled();
    expect(mockUserService.update).toHaveBeenCalledWith(1, mockUser);
  }
  );
});
