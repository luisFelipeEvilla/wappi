import { IsBoolean, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsBoolean()
    @IsOptional()
    is_driver?: boolean;
}
