import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RideModule } from 'src/ride/ride.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

describe('PaymentController', () => {
  let controller: PaymentController;

  let mockPaymentService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RideModule],
      controllers: [PaymentController],
      providers: [{
        provide: PaymentService,
        useValue: mockPaymentService
      }, {
        provide: getRepositoryToken(Payment),
        useValue: {}
      }],
    })
      .compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
