import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository (Ride) private readonly rideRepository: Repository<Ride>,
    @Inject(UserService) private readonly userService: UserService
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

  findAll() {
    return `This action returns all ride`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ride`;
  }

  update(id: number, updateRideDto: UpdateRideDto) {
    return `This action updates a #${id} ride`;
  }

  remove(id: number) {
    return `This action removes a #${id} ride`;
  }
}
