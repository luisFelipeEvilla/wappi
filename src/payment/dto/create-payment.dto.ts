import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/user/entities/user.entity';

export class CreatePaymentDto {
    @IsInt()
    amount: number;
    
    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsNotEmpty()
    wompi_id: string;

    @IsString()
    @IsNotEmpty()
    reference: string;
   
    @IsInt()
    payment_method_id: number;

    user: User;

    ride: Ride;
}
