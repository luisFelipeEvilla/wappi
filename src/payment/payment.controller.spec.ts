import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/user/entities/user.entity';

describe('PaymentController', () => {
  let controller: PaymentController;

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
    completed: true,
    end_location: {
      type: "Point",
      coordinates: [1, 1],
    },
    ride_ended_at: new Date(),
    ride_started_at: new Date(),
    start_location: {
      type: "Point",
      coordinates: [1, 1],
    },
    total_cost: 3500,
    driver: mockDriver,
    rider: mockRider,
  };

  const mockPayment: Payment = {
    payment_id: 1,
    amount: 3500,
    currency: 'COP',
    wompi_id: 'wompi_123',
    reference: '123',
    payment_method_id: 1,
    status: 'PENDING',
    created_at: '2021-09-28T02:57:01.000Z',
    updated_at: '2021-09-28T02:57:01.000Z',
    ride: mockRide,
    user: mockRider,
  };

  let mockPaymentService = {
    findAll: jest.fn().mockImplementation(() => [mockPayment]),
    findOne: jest.fn().mockImplementation((id: number) => {
      return mockPayment;
    }),
    create: jest.fn().mockImplementation((dto) => {
      return {
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        affected: 1
      };
    }),
    remove: jest.fn().mockImplementation((id) => {
      return {
        affected: 1
      };
    }),

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    })
      .overrideProvider(PaymentService)
      .useValue(mockPaymentService)
      .compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all payments', async () => {
    const payments = await controller.findAll();

    expect(payments).toEqual([mockPayment]);
    expect(mockPaymentService.findAll).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.findAll).toHaveBeenCalledWith();
  });

  it('should return one payment', async () => {
    const payment = await controller.findOne(1);

    expect(mockPaymentService.findOne).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.findOne).toHaveBeenCalledWith(1);
    expect(payment).toEqual(mockPayment);
  });

  it('should create a payment', async () => {
    const payment = await controller.create(mockPayment);

    expect(mockPaymentService.create).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.create).toHaveBeenCalledWith(mockPayment);
    expect(payment).toEqual(mockPayment);
  });

  it('should update a payment', async () => {
    const payment = await controller.update(1, mockPayment);

    expect(mockPaymentService.update).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.update).toHaveBeenCalledWith(1, mockPayment);
    expect(payment.affected).toEqual(1);
  });

  it('should remove a payment', async () => {
    const payment = await controller.remove(1);

    expect(mockPaymentService.remove).toHaveBeenCalledTimes(1);
    expect(mockPaymentService.remove).toHaveBeenCalledWith(1);
    expect(payment.affected).toEqual(1);
  });

});
