import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { PaymentService } from '..//payment/payment.service';
import { calcRideCost } from '../utils/general';
import axios from 'axios';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository (Ride) private readonly rideRepository: Repository<Ride>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(PaymentService) private readonly paymentService: PaymentService
  ) {}

  async create(createRideDto: CreateRideDto) {
    const rider = await this.userService.findOne(createRideDto.rider_id);

    const driver = await this.userService.findDriver(createRideDto.start_location);

    const ride = await this.rideRepository.create({
      driver: driver,
      rider: rider,
      start_location: createRideDto.start_location,
    })

    return await this.rideRepository.save(ride);
  }

  async findAll() {
    return await this.rideRepository.find();
  }

  async findOne(id: number) {
    const ride = await this.rideRepository.findOne({
      where: {
        ride_id: id
      }
      
    });

    if (!ride) {
      throw new HttpException('Ride not found', HttpStatus.NOT_FOUND);
    }

    return ride;
  }

  async update(id: number, updateRideDto: UpdateRideDto) {
    const ride = await this.findOne(id);

    // update ride
    ride.end_location = updateRideDto.end_location;
    ride.ride_ended_at = new Date();
    ride.total_cost = calcRideCost(ride);
    ride.completed = true;

    await this.rideRepository.save(ride);

    // payment
    try {
      const rider = await this.userService.findOne(ride.rider.user_id);

      if (!rider.payment_source_id) {
        throw new HttpException('User does not have a payment source', HttpStatus.BAD_REQUEST);
      };

      const PAYMENT_URL = `https://sandbox.wompi.co/v1/transactions`;

      const reference = `ride-${ride.ride_id}`;
      const amount_in_cents = ride.total_cost * 100;
      const currency = 'COP';
      
      const signature = await this.generateSignature(reference, amount_in_cents, currency);

      const paymentResponse = await this.generateTransaction(
        reference,
        amount_in_cents,
        currency,
        rider.email,
        rider.payment_source_id,
        signature
      );
      
      const payment = await this.paymentService.create({
        amount: amount_in_cents,
        currency: currency,
        wompi_id: paymentResponse.id,
        reference: reference,
        payment_method_id: rider.payment_source_id,
        user: rider,
        ride: ride
      });
    } catch (error) {
      console.error(error);
      return error;
    }
   

    return ride;
  }

  async remove(id: number) {
    const result = await this.rideRepository.delete(id);

    return result;
  }

  async generateSignature(reference: string, amount: number, currency: string) {
    const signature_seed = `${reference}${amount}${currency}${process.env.WOMPI_INTEGRITY_SIGNATURE}`;
  
    const encondedText = new TextEncoder().encode(signature_seed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
    return signature;
  }

  async generateTransaction(
    reference: string,
    amount: number,
    currency: string,
    email: string,
    paymentSourceId: number,
    signature: string,
  ) {
    const PAYMENT_URL = `https://sandbox.wompi.co/v1/transactions`;
  
    const paymentResponse = await axios.post(
      PAYMENT_URL,
      {
        reference,
        amount_in_cents: amount,
        currency,
        customer_email: email,
        payment_method: {
          installments: 1
        },
        payment_source_id: paymentSourceId,
        signature: signature
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      },
    );
  
    return paymentResponse.data.data;
  }
  
}
