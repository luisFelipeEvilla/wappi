import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';
import { User } from '../user/entities/user.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';

describe('RideController', () => {
  let controller: RideController;

  const mockDriver: User = {
    user_id: 1,
    email: '',
    is_driver: false,
    payment_source_id: 1,
  };

  const mockRider: User = {
    user_id: 1,
    email: '',
    is_driver: false,
    payment_source_id: 1,
  };

  const mockRide: Ride = {
    ride_id: 1,
    completed: false,
    end_location: null,
    ride_ended_at: null,
    ride_started_at: new Date(),
    start_location: {
      type: 'Point',
      coordinates: [1, 1],
    },
    total_cost: 3500,
    driver: mockDriver,
    rider: mockRider,
  };

  const mockCompletedRide: Ride = {
    ride_id: 1,
    completed: true,
    end_location: {
      type: 'Point',
      coordinates: [1, 1],
    },
    ride_ended_at: new Date(),
    ride_started_at: new Date(),
    start_location: {
      type: 'Point',
      coordinates: [1, 1],
    },
    total_cost: 3500,
    driver: null,
    rider: null,
  };

  const mockRideService = {
    create: jest.fn((dto) => mockRide),
    findAll: jest.fn(() => [mockRide]),
    findOne: jest.fn((id) => mockRide),
    update: jest.fn((id, dto) => mockCompletedRide),
    remove: jest.fn((id) => mockRide),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [RideService],
    })
      .overrideProvider(RideService)
      .useValue(mockRideService)
      .compile();

    controller = module.get<RideController>(RideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

    it('should create a ride', async () => {
        expect(controller.create).toBeDefined();
    
        const mockRideDto: CreateRideDto = {
            rider_id: 1,
            start_location: {
            type: "Point",
            coordinates: [1, 1],
            },
        };
    
        expect(await controller.create(mockRideDto)).toEqual(mockRide);

        expect(mockRideService.create).toHaveBeenCalledWith(mockRideDto);
        expect(mockRideService.create).toHaveBeenCalledTimes(1);
    });

    it('should get all rides', async () => {
        expect(controller.findAll).toBeDefined();

        expect(await controller.findAll()).toEqual([mockRide]);

        expect(mockRideService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should get a ride', async () => {
        expect(controller.findOne).toBeDefined();

        expect(await controller.findOne(1)).toEqual(mockRide);

        expect(mockRideService.findOne).toHaveBeenCalledWith(1);
        expect(mockRideService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should delete a ride', async () => {
        expect(controller.remove).toBeDefined();

        expect(await controller.remove(1)).toEqual(mockRide);

        expect(mockRideService.remove).toHaveBeenCalledWith(1);
        expect(mockRideService.remove).toHaveBeenCalledTimes(1);
    });
});
