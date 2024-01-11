import {IsString} from 'class-validator';
export class createPaymentMethodDto {
    @IsString()
    card_token: string;
}