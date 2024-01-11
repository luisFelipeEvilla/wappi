import { PartialType } from '@nestjs/mapped-types';
import { CreateRideDto } from './create-ride.dto';
import { Point } from 'typeorm';
import { IsNumber } from 'class-validator'

export class UpdateRideDto extends PartialType(CreateRideDto) {    
    end_location: Point;
}
