import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { generateSignature, generateTransaction } from 'src/utils/wompi';
import { PaymentService } from 'src/payment/payment.service';

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

    // calculate distance between start and end location
    const x1 = ride.start_location.coordinates[0];
    const y1 = ride.start_location.coordinates[1];

    const x2 = updateRideDto.end_location.coordinates[0];
    const y2 = updateRideDto.end_location.coordinates[1];

    const distance = this.calcularDistancia(x1, y1, x2, y2);

    // calculate ride time
    const end_time = new Date(); // we assume that the ride ends at the moment of the request
    const time = (end_time.getTime() - ride.ride_started_at.getTime()) / 1000 / 60;

    // calculate cost
    const cost = Math.floor(distance * 1000 + time * 200 + 3500);

    // update ride
    ride.end_location = updateRideDto.end_location;
    ride.ride_ended_at = end_time;
    ride.total_cost = cost;
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
      const amount_in_cents = cost * 100;
      const currency = 'COP';
      
      const signature = await generateSignature(reference, amount_in_cents, currency);

      const paymentResponse = await generateTransaction(
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

      payment.ride = ride;
      payment.user = rider;

      ride.paid = true;

      await this.rideRepository.save(ride);
    } catch (error) {
      console.error(error);
      return error;
    }
   

    return ride;
  }

  remove(id: number) {
    return `This action removes a #${id} ride`;
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radioTierra = 6371000; // Radio de la Tierra en metros
  
    const deltaLatitud = this.toRadians(lat2 - lat1);
    const deltaLongitud = this.toRadians(lon2 - lon1);
  
    const a =
      Math.sin(deltaLatitud / 2) * Math.sin(deltaLatitud / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(deltaLongitud / 2) * Math.sin(deltaLongitud / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distancia = radioTierra * c / 1000;
  
    return distancia;
  }
  
  toRadians(grados: number): number {
    return grados * (Math.PI / 180);
  }
  
}
