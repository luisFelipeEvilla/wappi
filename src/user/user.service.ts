import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Point, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository (User) private userRepository: Repository<User>
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();   
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ 
      where: { 
        user_id: id 
      } 
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id
      }
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.card_token) {
      const acceptanceToken = await this.getAcceptanceToken();
      const paymentSourceId = await this.createPaymentSource(updateUserDto.card_token, user.email, acceptanceToken);

      user.payment_source_id = paymentSourceId;
    }

    return await this.userRepository.save(user);
    // return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async findDriver(location: Point) {
    // todo: return closest driver
    const drivers = await this.userRepository.find({
      where: {
        is_driver: true
      }
    });

    return drivers[0];

  }

  async getAcceptanceToken() {
    const ACCEPTANCE_TOKEN_URL = `https://sandbox.wompi.co/v1/merchants/${process.env.WOMPI_PUBLIC_KEY}`;
  
    const tokenResponse = await axios.get(ACCEPTANCE_TOKEN_URL);
  
    return tokenResponse.data.data.presigned_acceptance.acceptance_token;
  }
  
  async createPaymentSource(
    cardToken: string,
    email: string,
    acceptanceToken: string,
  ) {
    const PAYMENT_SOURCE_URL = `https://sandbox.wompi.co/v1/payment_sources`;
  
    const paymentSourceResponse = await axios.post(
      PAYMENT_SOURCE_URL,
      {
        type: 'CARD',
        token: cardToken,
        customer_email: email,
        acceptance_token: acceptanceToken,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      },
    );
  
    return paymentSourceResponse.data.data.id;
  }
}