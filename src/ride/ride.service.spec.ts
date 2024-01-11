import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';
import { UserService } from '../user/user.service';
import { PaymentService } from '../payment/payment.service';
import { User } from '../user/entities/user.entity';
import { Payment } from '../payment/entities/payment.entity';

describe('RideService', () => {
  let service: RideService;

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
    driver: mockDriver,
    rider: mockRider,
  };

  const mockRideRepository = {
    create: jest.fn().mockImplementation((dto) => mockRide),
    save: jest.fn().mockImplementation((dto) => dto),
    find: jest.fn().mockImplementation(() => [mockCompletedRide]),
    findOne: jest.fn().mockImplementation((id: number) => {
      return mockCompletedRide;
    }),
    update: jest.fn().mockImplementation((id: number, dto) => {
      return {
        affected: 1,
      };
    }),
    delete: jest.fn().mockImplementation((id: number) => {
      return {
        affected: 1,
      };
    }),
  };

  const mockDriverRepository = {
    find: jest.fn().mockImplementation(() => [mockDriver]),
    findOne: jest.fn().mockImplementation((id: number) => {
      return mockDriver;
    }),
  };

  const mockPaymentRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RideService,
        UserService,
        PaymentService,
        {
          provide: getRepositoryToken(Ride),
          useValue: mockRideRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockDriverRepository,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<RideService>(RideService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a ride', async () => {
    const ride = await service.create({
      start_location: {
        type: 'Point',
        coordinates: [1, 1],
      },
      rider_id: 1,
    });

    // check if user exists
    expect(mockDriverRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockDriverRepository.findOne).toHaveBeenCalledWith({
      where: { user_id: 1 },
    });

    // check if driver a driver was found
    expect(mockDriverRepository.find).toHaveBeenCalledTimes(1);
    expect(mockDriverRepository.find).toHaveBeenCalledWith({
      where: { is_driver: true },
    });

    expect(mockRideRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRideRepository.create).toHaveBeenCalledWith({
      start_location: {
        type: 'Point',
        coordinates: [1, 1],
      },
      rider: mockRider,
      driver: mockDriver
    });
    expect(mockRideRepository.save).toHaveBeenCalledTimes(1);
    expect(ride).toEqual(mockRide);
  });

    it('should return all rides', async () => {
        const rides = await service.findAll();
    
        expect(rides).toEqual([mockCompletedRide]);
        expect(rides.length).toEqual(1);
        expect(mockRideRepository.find).toHaveBeenCalledTimes(1);
        expect(mockRideRepository.find).toHaveBeenCalledWith();
    });

    it('should return one ride', async () => {
        const ride = await service.findOne(1);
    
        expect(mockRideRepository.findOne).toHaveBeenCalledTimes(1);
        expect(mockRideRepository.findOne).toHaveBeenCalledWith({
          where: {
            ride_id: 1,
          },
        });
        expect(ride).toEqual(mockCompletedRide);
    });

    it('should delete a ride', async () => {
        const ride = await service.remove(1);
    
        expect(mockRideRepository.findOne).toHaveBeenCalledWith({
          where: {
            ride_id: 1,
          },
        });
        expect(mockRideRepository.delete).toHaveBeenCalledTimes(1);
        expect(mockRideRepository.delete).toHaveBeenCalledWith(1);
        expect(ride.affected).toEqual(1);
    });
});
