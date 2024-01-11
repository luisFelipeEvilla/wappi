import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { createPaymentMethodDto } from 'src/user/dto/create-payment-method';
import { Ride } from 'src/ride/entities/ride.entity';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockDriver = {
    user_id: 1,
    email: '',
    is_driver: false,
    payment_source_id: 1,
  };

  const mockRider = {
    user_id: 1,
    email: '',
    is_driver: false,
    payment_source_id: 1,
  };

  const mockRide: Ride = {
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

  const mockPaymentRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((dto) => dto),
    find: jest.fn().mockImplementation(() => [mockPayment]),
    findOne: jest.fn().mockImplementation((id) => {
      return mockPayment;
    }),
    update: jest.fn().mockImplementation(() => {
      return { affected: 1 };
    }),
    delete: jest.fn().mockImplementation(() => {
      return { affected: 1 };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment', async () => {
    const payment = await service.create(mockPayment);

    expect(payment).toEqual(mockPayment);
  });

  it('should return all payments', async () => {
    const payments = await service.findAll();

    expect(payments).toEqual([mockPayment]);
    expect(payments.length).toEqual(1);
    expect(mockPaymentRepository.find).toHaveBeenCalledTimes(1);
    expect(mockPaymentRepository.find).toHaveBeenCalledWith();
  });

  it('should return one payment', async () => {
    const payment = await service.findOne(1);

    expect(mockPaymentRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockPaymentRepository.findOne).toHaveBeenCalledWith({
      where: {
        payment_id: 1,
      },
    });
    expect(payment).toEqual(mockPayment);
  });

  it('should update a payment', async () => {
    const payment = await service.update(1, {
      amount: 3500,
      currency: 'COP',
      wompi_id: 'wompi_123',
      reference: '123',
      payment_method_id: 1,
      status: 'PENDING',
    });

    expect(payment.affected).toEqual(1);

    expect(mockPaymentRepository.update).toHaveBeenCalledTimes(1);
    expect(mockPaymentRepository.update).toHaveBeenCalledWith(1, {
      amount: 3500,
      currency: 'COP',
      wompi_id: 'wompi_123',
      reference: '123',
      payment_method_id: 1,
      status: 'PENDING',
    });
  });

  it('should delete a payment', async () => {
    const payment = await service.remove(1);

    expect(payment.affected).toEqual(1);
    expect(mockPaymentRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockPaymentRepository.delete).toHaveBeenCalledWith(1);
  });
});
