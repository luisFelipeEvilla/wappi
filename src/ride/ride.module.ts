import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { PaymentModule } from 'src/payment/payment.module';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride, User, Payment]),
    UserModule,
    PaymentModule
  ],
  controllers: [RideController],
  providers: [RideService, PaymentService],
})
export class RideModule {}
