import { HttpException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.paymentRepository.save(createPaymentDto);
  }

  async findAll() {
    return await this.paymentRepository.find();
  }

  findOne(id: number) {
    const payment = this.paymentRepository.findOne({
      where: { payment_id: id },
    });
    
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = this.findOne(id);

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return await this.paymentRepository.update(id, updatePaymentDto);
  }

  async remove(id: number) {
    const payment = this.findOne(id);

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return await this.paymentRepository.delete(id);
  }
}
