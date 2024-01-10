import { IsBoolean, IsEmail, IsLatitude, IsLongitude } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsBoolean()
    is_driver: boolean;

    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;
}
